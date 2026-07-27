export type ComboboxViewportInput = {
  triggerTop: number;
  triggerBottom: number;
  triggerLeft: number;
  triggerWidth: number;
  viewportWidth: number;
  viewportHeight: number;
  margin?: number;
};

export type ComboboxViewportOutput = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placeAbove: boolean;
};

export function computeComboboxViewport(input: ComboboxViewportInput): ComboboxViewportOutput {
  const margin = Math.max(8, input.margin ?? 12);
  const spaceBelow = input.viewportHeight - input.triggerBottom - margin;
  const spaceAbove = input.triggerTop - margin;
  const placeAbove = spaceAbove > spaceBelow && spaceAbove > 140;

  const width = Math.max(220, Math.min(input.triggerWidth, input.viewportWidth - margin * 2));
  const left = Math.min(
    Math.max(margin, input.triggerLeft),
    Math.max(margin, input.viewportWidth - width - margin),
  );

  const top = placeAbove
    ? Math.max(margin, input.triggerTop - margin)
    : Math.min(input.viewportHeight - margin, input.triggerBottom + 8);

  const maxHeight = Math.max(140, Math.min(placeAbove ? spaceAbove - 8 : spaceBelow - 8, 360));

  return { top, left, width, maxHeight, placeAbove };
}
