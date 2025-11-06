import { startStimulusApp } from '@symfony/stimulus-bridge';
import { SheetController, SheetListController } from '../vendor/stimulus-sheet/dist/index.esm.js';

// Registers Stimulus controllers from controllers.json and in the controllers/ directory
export const app = startStimulusApp(require.context(
    '@symfony/stimulus-bridge/lazy-controller-loader!./controllers',
    true,
    /\.[jt]sx?$/
));

// Register sheet controllers from stimulus-sheet
app.register('sheet', SheetController);
app.register('sheet-list', SheetListController);
