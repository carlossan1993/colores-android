# Motor de coloreado

`coloringReducer.ts` es independiente de React y de los assets. Solo acepta IDs declarados y colores hexadecimales; representa las zonas sin pintar mediante ausencia de color. El blanco borra la región.

`InteractiveDrawing.tsx` dibuja los paths nativos de `react-native-svg`: cada región transmite su propio ID por `onPress`. El relleno cambia, el contorno permanece fijo. Las zonas superiores se dibujan después de la pared para mantener sus áreas táctiles independientes.

Undo/redo conservan instantáneas de los colores con un límite de 50 cambios. Repintar con el mismo color es un no-op; pintar tras deshacer elimina la rama de redo. Reset se confirma en la UI y se registra como una acción reversible. El progreso/completado se calcula a partir de las regiones definidas.

No hay guardado en disco en esta etapa. La selección de color es estado de la UI y no cambia al deshacer, rehacer o reiniciar.
