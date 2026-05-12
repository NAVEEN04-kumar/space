import { showDetail } from '../../src/components/DetailModal.js';

describe("DetailModal Component", () => {
  beforeEach(() => {
    // Create dummy DOM
    const modal = document.createElement('div');
    modal.id = 'detail-modal';
    
    const icon = document.createElement('div');
    icon.id = 'modal-icon';
    const name = document.createElement('div');
    name.id = 'modal-name';
    const type = document.createElement('div');
    type.id = 'modal-type';
    const facts = document.createElement('div');
    facts.id = 'modal-facts';
    
    modal.appendChild(icon);
    modal.appendChild(name);
    modal.appendChild(type);
    modal.appendChild(facts);
    
    document.body.appendChild(modal);
  });

  afterEach(() => {
    // Clean up DOM
    const modal = document.getElementById('detail-modal');
    if (modal) modal.remove();
  });

  it("should populate modal with star details", () => {
    const mockStar = { name: 'Sirius', type: 'star', mag: -1.46, alt: 45, az: 180, icon: '★', fact: 'Brightest', dist: '8.6 ly', temp: '9,940 K', color: 'Blue-white' };
    showDetail(mockStar);
    
    const name = document.getElementById('modal-name');
    expect(name.textContent).toBe('Sirius');
    
    const facts = document.getElementById('modal-facts');
    expect(facts.innerHTML).toContain('8.6 ly');
  });
});
