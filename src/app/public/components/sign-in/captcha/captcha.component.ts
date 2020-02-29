import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'public-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit {

  @Input() get lengthOtp() {
    return environment.cantCharacters;
  }

  @Output() codigo: EventEmitter<string> = new EventEmitter<string>();

  private readonly charts = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // private readonly charts = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*';

  constructor() { }

  ngOnInit() {
    this.createCaptcha();
  }

  createCaptcha() {
    // clear the contents of captcha div first
    document.getElementById('captcha').innerHTML = '';

    const captcha = [];

    for (let i = 0; i < this.lengthOtp; i++) {
      // below code will not allow Repetition of Characters
      const index = Math.floor(Math.random() * this.charts.length + 1);
      // get the next character from the array
      if (captcha.indexOf(this.charts[index]) === -1) {
        captcha.push(this.charts[index]);
      } else {
        i--;
      }
    }

    const canv = document.createElement('canvas');
    canv.id = 'captcha';
    canv.width = 200;
    canv.height = 50;
    const ctx = canv.getContext('2d');
    ctx.font = '25px Georgia';
    ctx.strokeText(captcha.join(''), 0, 30);
    // storing captcha so that can validate you can save it somewhere else according to your specific requirements
    this.codigo.emit(captcha.join(''));
    document.getElementById('captcha').appendChild(canv); // adds the canvas to the body element
  }

}
