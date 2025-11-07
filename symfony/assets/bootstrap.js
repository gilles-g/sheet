import { startStimulusApp } from '@symfony/stimulus-bridge';
import { SheetController, SheetListController } from 'stimulus-sheet';

// Registers Stimulus controllers from controllers.json and in the controllers/ directory
export const app = startStimulusApp(require.context(
    '@symfony/stimulus-bridge/lazy-controller-loader!./controllers',
    true,
    /\.[jt]sx?$/
));

// Register sheet controllers
app.register('sheet', SheetController);
app.register('sheet-list', SheetListController);

// Make the Stimulus application globally available for easy access
window.Stimulus = app;
