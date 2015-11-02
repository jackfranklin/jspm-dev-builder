import $ from 'jquery';
import Ember from 'ember';
import { testThing } from './test-module';
import tmpl from './main.hbs!';

$(() => {
  testThing();
  $('body').css('background-color', 'red');
});

var App = Ember.Application.extend({});
Ember.TEMPLATES.index = tmpl;
App.create({
  rootElement: '#app'
});

