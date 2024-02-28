import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { AuthorDto, AuthorService } from '@proxy/authors';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss',
  providers: [ListService, { provide: NgbDatepickerModule, useClass: NgbDatepickerModule }]
})
export class AuthorComponent implements OnInit {

  author = { items: [], totalCount: 0 } as PagedResultDto<AuthorDto>;

  isModalOpen = false;

  form: FormGroup;

  selectedAuthor = {} as AuthorDto;

  constructor(
    public readonly list: ListService,
    private authorService: AuthorService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService
  ) { }

  ngOnInit(): void {
    const authorStreamCreator = (query) => this.authorService.getList(query);

    this.list.hookToQuery(authorStreamCreator).subscribe((response) => {
      this.author = response;
    });
  }

  createAuthor(){
    this.selectedAuthor = {} as AuthorDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  delete(id: string){
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if(status === Confirmation.Status.confirm) {
        this.authorService.delete(id).subscribe(() => this.list.get());
      }
    });
  }

  editAuthor(id: string){
    this.authorService.get(id).subscribe((book) => {
      this.selectedAuthor = book;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  buildForm(){
    this.form = this.fb.group({
      name: [this.selectedAuthor.name || '', Validators.required],
      birthDate: [
        this.selectedAuthor.birthDate ? new Date(this.selectedAuthor.birthDate) : null],
      shortBio: [this.selectedAuthor.shortBio || null, Validators.required],
    });
  }

  save(){
    if(this.form.invalid){
      return;
    }

    const request = this.selectedAuthor.id
      ? this.authorService.update(this.selectedAuthor.id, this.form.value)
      : this.authorService.create(this.form.value);

    this.authorService.create(this.form.value).subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }
}
