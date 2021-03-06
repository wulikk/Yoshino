import * as React from 'react';
import { Component } from 'react';
import * as md from './index.md';
import Markdown from '@docs/components/Markdown/';
import CodeBox from '@docs/components/CodeBox/';
import ApiBox from '@docs/components/ApiBox/';
import Api from './api';

import LoadingDemo from './demo/loadingDemo';
import * as loadingDemoMd from './demo/loadingDemo.md';
const loadingDemoCode = require('!raw-loader!./demo/loadingDemo');

import LoadingCustom from './demo/loadingCustom';
import * as loadingCustomMd from './demo/loadingCustom.md';
const loadingCustomCode = require('!raw-loader!./demo/loadingCustom');

import LoadingContainer from './demo/loadingContainer';
import * as loadingContainerMd from './demo/loadingContainer.md';
const loadingContainerCode = require('!raw-loader!./demo/loadingContainer');

export default class LoadingPage extends Component {
  render() {
    return (
      <div>
        <Markdown text={md}/>
        <CodeBox text={loadingDemoMd} demo={<LoadingDemo/>} code={loadingDemoCode}/>

        <CodeBox text={loadingCustomMd} demo={<LoadingCustom/>} code={loadingCustomCode}/>

        <CodeBox text={loadingContainerMd} demo={<LoadingContainer/>} code={loadingContainerCode}/>
        <ApiBox api={Api}/>
      </div>
    );
  }
}
