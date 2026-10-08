import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('opens the welcome screen and changes the selected color', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(
    renderer.root.findAllByProps({ children: 'Colores' }).length,
  ).toBeGreaterThan(0);
  const buttons = renderer.root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
  expect(buttons).toHaveLength(6);
  expect(buttons[0].props.accessibilityState.selected).toBe(true);
  await ReactTestRenderer.act(() => buttons[3].props.onPress());
  expect(buttons[3].props.accessibilityState.selected).toBe(true);
  expect(buttons[0].props.accessibilityState.selected).toBe(false);
  await ReactTestRenderer.act(() => renderer.unmount());
});
