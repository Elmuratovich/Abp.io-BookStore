using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Acme.BookStore.Authors
{
    public interface IAuthorAppService :
        ICrudAppService< // Defines CRUD methods
            AuthorDto, // Used to show books
            Guid, // Primary key of the book entity
            PagedAndSortedResultRequestDto, // Used for paging/sorting
            CreateAuthorDto,
            UpdateAuthorDto>
    {

    }
}
