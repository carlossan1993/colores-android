import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SettingsScreen } from '../src/screens/SettingsScreen';
import { privacyPolicySections } from '../src/content/privacyPolicy';

test('families can read and hide the complete privacy policy offline', async () => {
  const onToggleSound = jest.fn();
  const onBack = jest.fn();
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  try {
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <SettingsScreen
          soundEnabled={false}
          onToggleSound={onToggleSound}
          onBack={onBack}
        />,
      );
    });
    const control = () =>
      renderer.root.findAll(
        node =>
          node.props.testID === 'settings-policy-toggle' &&
          typeof node.props.onPress === 'function',
      )[0];
    const fullPolicy = () =>
      renderer.root.findAll(node => node.props.testID === 'settings-policy-full');

    expect(fullPolicy()).toHaveLength(0);
    expect(control().props.accessibilityState.expanded).toBe(false);
    await ReactTestRenderer.act(() => control().props.onPress());
    expect(fullPolicy()).toHaveLength(1);
    expect(control().props.accessibilityState.expanded).toBe(true);

    const visibleText = JSON.stringify(renderer.toJSON());
    expect(privacyPolicySections).toHaveLength(8);
    expect(visibleText).toContain('colorimbo.app@gmail.com');
    expect(visibleText).toContain('Uso y conservación');

    await ReactTestRenderer.act(() => control().props.onPress());
    expect(fullPolicy()).toHaveLength(0);
    expect(onToggleSound).not.toHaveBeenCalled();
    expect(onBack).not.toHaveBeenCalled();
  } finally {
    if (renderer) {
      await ReactTestRenderer.act(() => renderer.unmount());
    }
  }
});
