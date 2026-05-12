import { showPanel } from '../../src/components/StarPanel.js';

describe("StarPanel Component", () => {
  beforeEach(() => {
    // Create dummy DOM
    const panel = document.createElement('div');
    panel.id = 'star-panel';
    const list = document.createElement('div');
    list.id = 'star-list';
    panel.appendChild(list);
    document.body.appendChild(panel);
  });

  afterEach(() => {
    // Clean up DOM
    const panel = document.getElementById('star-panel');
    if (panel) panel.remove();
  });

  it("should populate list with stars", () => {
    const mockStars = [{ name: 'Sirius', type: 'star', mag: -1.46, alt: 45, az: 180, icon: '★', fact: 'Brightest' }];
    showPanel(mockStars);
    
    const list = document.getElementById('star-list');
    expect(list.children.length).toBe(1);
    expect(list.innerHTML).toContain('Sirius');
  });

  it("should show empty message if no stars", () => {
    showPanel([]);
    const list = document.getElementById('star-list');
    expect(list.innerHTML).toContain('Point at the sky');
  });

  it("should handle stars with missing properties", () => {
    const mockStars = [{ name: 'Mystery Star', type: 'star', mag: 2.0, icon: '★' }];
    showPanel(mockStars);
    
    const list = document.getElementById('star-list');
    expect(list.children.length).toBe(1);
    expect(list.innerHTML).toContain('Mystery Star');
  });
});
