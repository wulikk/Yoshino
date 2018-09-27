import * as renderer from 'react-test-renderer';
import * as React from 'react';
import Grid from '../index';

describe('Props', () => {

  test('默认', () => {
    const component = renderer.create(
      <Grid/>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
