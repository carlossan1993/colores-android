import React from 'react';
import { Alert } from 'react-native';
import { Path } from 'react-native-svg';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { palette } from '../src/theme/palette';

test('connects native SVG touches, palette, undo/redo and confirmed reset', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  const dialog = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  try {
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<App />);
    });
    const regions = renderer.root
      .findAllByType(Path)
      .filter(region => region.props.testID?.startsWith('region-'));
    expect(regions).toHaveLength(8);
    const roof = regions.find(region => region.props.id === 'roof')!;
    const button = (label: string) =>
      renderer.root.findAll(
        node =>
          node.props.accessibilityLabel === label &&
          typeof node.props.onPress === 'function',
      )[0];
    expect(button('Deshacer').props.disabled).toBe(true);

    await ReactTestRenderer.act(() => roof.props.onPress());
    expect(roof.props.fill).toBe(palette[0].color);
    for (const other of regions.filter(region => region.props.id !== 'roof')) {
      expect(other.props.fill).toBe('#FFFFFF');
    }
    expect(roof.props.stroke).toBe('#202020');

    await ReactTestRenderer.act(() => button('Elegir verde').props.onPress());
    await ReactTestRenderer.act(() => roof.props.onPress());
    expect(roof.props.fill).toBe('#66BE96');
    await ReactTestRenderer.act(() => button('Deshacer').props.onPress());
    expect(roof.props.fill).toBe(palette[0].color);
    expect(button('Elegir verde').props.accessibilityState.selected).toBe(true);
    await ReactTestRenderer.act(() => button('Rehacer').props.onPress());
    expect(roof.props.fill).toBe('#66BE96');

    await ReactTestRenderer.act(() => button('Reiniciar').props.onPress());
    expect(roof.props.fill).toBe('#66BE96');
    const choices = dialog.mock.calls[0][2]!;
    expect(choices.find(choice => choice.text === 'Cancelar')?.style).toBe(
      'cancel',
    );
    await ReactTestRenderer.act(() =>
      choices.find(choice => choice.text === 'Borrar')!.onPress!(),
    );
    expect(roof.props.fill).toBe('#FFFFFF');
    expect(button('Elegir verde').props.accessibilityState.selected).toBe(true);
    await ReactTestRenderer.act(() => button('Deshacer').props.onPress());
    expect(roof.props.fill).toBe('#66BE96');
    expect(roof.props.stroke).toBe('#202020');
  } finally {
    if (renderer) {
      await ReactTestRenderer.act(() => renderer.unmount());
    }
    dialog.mockRestore();
  }
});
