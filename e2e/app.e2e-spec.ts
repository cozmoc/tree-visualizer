import { TreeVisualizerPage } from './app.po';

describe('tree-visualizer App', () => {
  let page: TreeVisualizerPage;

  beforeEach(() => {
    page = new TreeVisualizerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
