export function widgetNavigation(view) {
  // ----------------- Navigation widget ----------------- //

  const widgets = new itowns_widgets.Navigation(view);
  // console.log(itowns_widgets)

  widgets.addButton(
    'rotate-up',
    '<p style="font-size: 20px">&#8595</p>',
    'rotate camera up',
    () => {
      view.controls.lookAtCoordinate({
        tilt: view.controls.getTilt() - 10,
        time: 500,
      });
    },
    'button-bar-rotation',
  );
  widgets.addButton(
    'rotate-down',
    '<p style="font-size: 20px">&#8593</p>',
    'rotate camera down',
    () => {
      view.controls.lookAtCoordinate({
        tilt: view.controls.getTilt() + 10,
        time: 500,
      });
    },
    'button-bar-rotation',
  );
  widgets.addButton(
    'reset-position',
    '&#8634',
    'reset position',
    () => { view.controls.lookAtCoordinate(placement) },
  );

}