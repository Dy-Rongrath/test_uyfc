import { NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent, QuillModules } from 'ngx-quill';

@Component({
    selector: 'shared-quill-editor',
    templateUrl: './template.html',
    standalone: true,
    imports: [MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, QuillEditorComponent],
})
export class SharedQuillEditorComponent implements OnInit {

    @Output() onPushed = new EventEmitter<any>();
    reviewForm: UntypedFormGroup;
    atValues = [
        { id: 1, value: 'Fredrik Sundqvist', link: 'https://google.com' },
        { id: 2, value: 'Patrik Sjölin' }
    ];
    hashValues = [
        { id: 3, value: 'Fredrik Sundqvist 2' },
        { id: 4, value: 'Patrik Sjölin 2' }
    ]
    quillModules: QuillModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
        ],
    };
    constructor(private _formBuilder: UntypedFormBuilder) { }
    ngOnInit(): void {
        this.reviewForm = this._formBuilder.group({
            body: ['', [Validators.required]],
        });
        //======================================================
        this.reviewForm.valueChanges.subscribe((newValues) => {
            this.onPushed.emit({
                comment: newValues.body
            });
        });
    }
}
