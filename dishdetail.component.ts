import { Component, OnInit ,Input, Inject} from '@angular/core';
import 'rxjs/add/operator/switchMap';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Dish} from '../shared/dish';
import { Comment} from '../shared/comment'; 
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { visibility } from '../animations/app.animation';
import { flyInOut } from '../animations/app.animation';
import { expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;

  commentsForm:FormGroup;
  comments: Comment;

  errMess: string;

  dishcopy = null;
  visibility = 'shown';


           this.route.params
      .switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); })
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
          errmess => { this.dish = null; this.errMess = <any>errmess; });


formErrors = {
    'author': '',
    'comment': '',
    'rating': ''
  };

  validationMessages = {
    'author': {
      'required':      'author Name is required.',
      'minlength':     'author Name must be at least 2 characters long.',
      'maxlength':     'author name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'comment is required.',
      'minlength':     'comment must be at least 2 characters long.',
      'maxlength':     'comment cannot be more than 25 characters long.'
    }
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,private cm: FormBuilder,@Inject('BaseURL') private BaseURL) {

    this.createForm();

     }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },errmess => this.errMess = <any>errmess);

  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() :void {
    this.commentsForm = this.cm.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating : 5
    });

    this.commentsForm.valueChanges
      .subscribe(data => this.onValueChanged(data),errmess => this.errMess = <any>errmess);

    this.onValueChanged(); // (re)set validation messages now
    }


    onValueChanged(data?: any) {
    if (!this.commentsForm) { return; }
    const form = this.commentsForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

    onSubmit() {
    this.comments = this.commentsForm.value;
    console.log(this.comments);
    var d = new Date();
    var n = d.toISOString();
    this.comments.date=n;
    this.dish.comments.push(this.comments);
    this.commentsForm.reset({
      author: '',
    comment: '',
    rating: ''
    });

    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save()
      .subscribe(dish => { this.dish = dish; console.log(this.dish); });
  }

}
