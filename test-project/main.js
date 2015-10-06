import $ from 'jquery';
import { testThing } from './test-module';

testThing();

$(() => {
  $('body').css('background-color', 'red');
});


