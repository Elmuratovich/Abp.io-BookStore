using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Services;

namespace Acme.BookStore.Authors
{
    public class AuthorManager : DomainService
    {
        private readonly IAuthorRepository _authorRepository;
        public AuthorManager(IAuthorRepository authorRepository)
        {
            _authorRepository = authorRepository;
        }

        public async Task<Author> CreateAsync(
            [System.Diagnostics.CodeAnalysis.NotNull] string name,
            DateTime birthDate,
            [CanBeNull] string shortBio = null)
        {
            Check.NotNullOrWhiteSpace(name, nameof(name));

            var existingAuthor = await _authorRepository.FindByNameAsync(name);
            if(existingAuthor != null)
            {
                throw new AuthorAlreadyExistsException(name);
            }

            return new Author(
                GuidGenerator.Create(),
                name,
                birthDate,
                shortBio
            );
        }

        public async Task ChangeNameAsync(
            [System.Diagnostics.CodeAnalysis.NotNull] Author author,
            [System.Diagnostics.CodeAnalysis.NotNull] string newName)
        {
            Check.NotNull(author, nameof(author));
            Check.NotNullOrWhiteSpace(newName, nameof(newName));

            var existingAuthor = await _authorRepository.FindByNameAsync(newName);
            if(existingAuthor != null && existingAuthor.Id != author.Id)
            {
                throw new AuthorAlreadyExistsException(newName);
            }

            author.ChangeName(newName);
        }
    }
}
