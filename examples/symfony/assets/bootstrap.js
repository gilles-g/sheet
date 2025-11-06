import { startStimulusApp } from '@symfony/stimulus-bundle';
import { SheetController, SheetListController } from 'stimulus-sheet';

const app = startStimulusApp();

// Register sheet controllers
app.register('sheet', SheetController);
app.register('sheet-list', SheetListController);

export { app };
