// ===== 1. Input Boxes Definition =====
const inputBoxes = [
  {
    InputType: 'checkbox',
    ID: 'CrimpHeightNA',
    InputText: 'Crimp Height Not Applicable',
    // Do not force a default value; let it reflect the page’s state.
    InputTarget: '[name$=".inline_crimp_height"]'
  },
  {
    InputType: 'dropDown',
    ID: 'PullTesterID',
    InputText: 'Pull Tester ID',
    InputTarget: '[name$=".pull_tester"]',
    InputName: 'pullTesterID'
  },
  {
    InputType: 'text',
    ID: 'WireAWG',
    InputText: 'Wire AWG',
    InputTarget: '[name$=".wire_awg"]',
    InputName: 'wireAWG',
    InputPlaceholder: 'AWG'
  },
  {
    InputType: 'dropDown',
    ID: 'PullTestStandard',
    InputText: 'Pull Test Standard',
    value: 3,
    InputTarget: '[name$=".pull_test_type"]',
    Selections: [
      { text: 'Other', value: 3 },
      { text: 'UL', value: 0 },
      { text: 'Ferrule', value: 1 },
      { text: 'Military', value: 2 },
      { text: 'NASA-STD', value: 4 }
    ]
  },
  {
    InputType: 'number',
    ID: 'MinPullForce',
    InputText: 'Minimum Pull Force',
    InputTarget: '[name$=".wire_spec"]',
    InputName: 'minPullForce'
  },
  {
    InputType: 'number',
    ID: 'Result1',
    InputText: 'Test Result 1',
    InputTarget: '[name$=".test_1"]',
    InputName: 'result1'
  },
  {
    InputType: 'number',
    ID: 'Result2',
    InputText: 'Test Result 2',
    InputTarget: '[name$=".test_2"]',
    InputName: 'result2'
  },
  {
    InputType: 'number',
    ID: 'Result3',
    InputText: 'Test Result 3',
    InputTarget: '[name$=".test_3"]',
    InputName: 'result3'
  },
  {
    InputType: 'dropDown',
    ID: 'ResultsAccepted',
    InputText: 'Result',
    value: 0,
    InputTarget: '[name$=".pull_test_status"]',
    InputName: 'resultsAccepted',
    Selections: [
      { text: 'Accepted', value: 0 },
      { text: 'Rejected', value: 1 }
    ]
  }
];


// ===== 2. Sidebar Module =====
const Sidebar = (() => {
  // Create the sidebar element.
  const create = () => {
    const sidebar = document.createElement('div');
    sidebar.id = 'my-sidebar';
    sidebar.classList.add('sidebar', 'pt-3');
    sidebar.innerHTML = `
      <div class="pl-3 pr-3">
        <h2>Pull Test Helper</h2>
        <span class="ml-2 mr-2">
          Expand Component Lines <i id="expandBtn" class="ml-2 btn btn-light fa fa-chevron-down"></i>
        </span>
        <div class="result-inputs mt-3"></div>
      </div>
    `;
    return sidebar;
  };

  // Toggle the sidebar and push the main app content.
  const toggle = () => {
    const sidebar = document.getElementById('my-sidebar');
    if (!sidebar) return;
    const isOpen = sidebar.style.width === '300px';
    sidebar.style.width = isOpen ? '0px' : '300px';

    // Push/pull the main content (if an element with class ".app" exists).
    const appContainer = document.querySelector('.app');
    if (appContainer) {
      appContainer.classList.toggle('sidebar-active', !isOpen);
    }

    // (Optional) Toggle chevron icon classes if an element with id "chevronIcon" exists.
    const chevronIcon = document.getElementById('chevronIcon');
    if (chevronIcon) {
      chevronIcon.classList.toggle('fa-chevron-right', isOpen);
      chevronIcon.classList.toggle('fa-chevron-left', !isOpen);
    }
  };

  return { create, toggle };
})();


// ===== 3. Insert CSS Styling =====
const style = document.createElement('style');
style.textContent = `
  /* Sidebar styling */
  #my-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 0px; /* Start collapsed */
    height: calc(100vh - 55px);
    background-color: #373a3c;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    color: white;
    overflow-y: auto;
    transition: width 0.3s ease;
    margin-top: 55px;
    padding: 15px;
  }
  /* When sidebar is active, push the main app content (assumes a container with class .app) */
  .app.sidebar-active {
    margin-right: 300px;
    transition: margin-right 0.3s ease;
  }
`;
document.head.appendChild(style);


// ===== 4. Create Input Boxes =====
const createInputBoxes = () => {
  const container = document.querySelector('.result-inputs');
  if (!container) return;

  inputBoxes.forEach(item => {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('input-group', 'mt-3', 'd-flex', 'flex-column');

    const label = document.createElement('label');
    label.setAttribute('for', item.InputName || item.ID);
    const bold = document.createElement('b');
    bold.innerText = item.InputText;
    label.appendChild(bold);

    const inputDiv = document.createElement('div');
    let inputElement;

    switch (item.InputType) {
      case 'text':
        inputElement = document.createElement('input');
        inputElement.type = item.InputType;
        inputElement.id = item.ID;
        if (item.value !== undefined) inputElement.value = item.value;
        if (item.InputName) inputElement.name = item.InputName;
        if (item.InputPlaceholder) inputElement.placeholder = item.InputPlaceholder;
        inputElement.classList.add('form-control');
        break;
      case 'number':
        inputElement = document.createElement('input');
        inputElement.type = item.InputType;
        inputElement.id = item.ID;
        if (item.value !== undefined) inputElement.value = item.value;
        if (item.InputName) inputElement.name = item.InputName;
        if (item.InputPlaceholder) inputElement.placeholder = item.InputPlaceholder;
        inputElement.classList.add('form-control');
        break;
      case 'checkbox':
        inputElement = document.createElement('input');
        inputElement.type = 'checkbox';
        inputElement.id = item.ID;
        // Do not force checked state—match what is already on the page.
        // inputElement.checked remains whatever is defined on the page.
        inputElement.style.height = 'auto';
        inputElement.classList.add('form-control');
        break;
      case 'dropDown':
        inputElement = document.createElement('select');
        inputElement.id = item.ID;
        if (item.InputName) inputElement.name = item.InputName;
        inputElement.classList.add('form-control');
        if (item.Selections && Array.isArray(item.Selections)) {
          item.Selections.forEach(({ text, value }) => {
            const option = document.createElement('option');
            option.value = value;
            option.innerText = text;
            inputElement.appendChild(option);
          });
        }
        if (item.ID === 'ResultsAccepted') {
          inputElement.disabled = true;
        }
        if (item.ID === 'PullTestStandard') {
          inputElement.addEventListener('change', () => {
            const minForceInput = document.getElementById('MinPullForce');
            if (minForceInput) {
              minForceInput.disabled = (inputElement.value != 3);
            }
          });
        }
        // For PullTesterID, update options from the current page if empty.
        if (item.ID === 'PullTesterID') {
          inputElement.addEventListener('click', () => {
            if (inputElement.options.length === 0) {
              updateInputToDropdown();
            }
          });
        }
        break;
      default:
        console.warn('Unknown InputType:', item.InputType);
    }
    if (inputElement) {
      inputDiv.appendChild(inputElement);
    }
    groupDiv.appendChild(label);
    groupDiv.appendChild(inputDiv);
    container.appendChild(groupDiv);
  });

  // "Update Values" button.
  const updateBtn = document.createElement('button');
  updateBtn.id = 'update-values-button';
  updateBtn.className = 'btn btn-primary m-2';
  updateBtn.innerText = 'Update Values';
  updateBtn.addEventListener('click', fillPullTestLog);

  // "Clear" button.
  const clearBtn = document.createElement('button');
  clearBtn.id = 'clear-pull-button';
  clearBtn.className = 'btn btn-secondary m-2';
  clearBtn.innerText = 'Clear';
  clearBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('#my-sidebar input, #my-sidebar select');
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        input.checked = false;
      } else {
        input.value = '';
      }
      updateReactInput(input, input.value);
    });
  });

  const sidebar = document.getElementById('my-sidebar');
  if (sidebar) {
    sidebar.appendChild(updateBtn);
    sidebar.appendChild(clearBtn);
  }

  // Add live validation for test result inputs.
  ['Result1', 'Result2', 'Result3', 'MinPullForce'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateResultsAccepted);
    }
  });
};


// ===== 5. fillPullTestLog Function =====
// Loops through record cards and updates matching fields.
const fillPullTestLog = () => {
  if (!window.location.href.includes('/intranet#/pull-test/add')) return;
  const records = document.querySelectorAll('.mb-0.card');
  records.forEach(record => {
    const headerSpan = Array.from(record.querySelectorAll('.card-header span'))
      .find(span => span.innerText.includes('Record ID: New'));
    if (!headerSpan) return;
    inputBoxes.forEach(({ InputType, ID, InputTarget }) => {
      const targets = record.querySelectorAll(InputTarget);
      if (!targets.length) return;
      
      if (InputType === 'checkbox') {
        // For checkboxes, use the checked state rather than the value.
        const sidebarCheckbox = document.getElementById(ID).checked;
        // const shouldBeChecked = sidebarCheckbox ? sidebarCheckbox.checked : false;
        targets.forEach(checkbox => {
          if (checkbox.checked != sidebarCheckbox) {
            // Option 1: Directly set the checked state and dispatch events.
            checkbox.click();
            checkbox.dispatchEvent(new Event('input', { bubbles: true }));
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            // Option 2: Alternatively, you could simulate a click if that is required.
          }
        });
      } else {
        // For text, number, and dropDown inputs.
        const sidebarInput = document.getElementById(ID);
        const inputValue = sidebarInput ? sidebarInput.value : '';
        targets.forEach(target => {
          updateReactInput(target, inputValue);
        });
      }
    });
  });
};


// ===== 6. updateReactInput Helper =====
function updateReactInput(target, value) {
  target.value = value;
  target.dispatchEvent(new Event('input', { bubbles: true }));
  target.dispatchEvent(new Event('change', { bubbles: true }));
}


// ===== 7. updateResultsAccepted Function =====
// Compares test results against the minimum pull force.
function updateResultsAccepted() {
  const r1 = parseFloat(document.getElementById('Result1')?.value) || 0;
  const r2 = parseFloat(document.getElementById('Result2')?.value) || 0;
  const r3 = parseFloat(document.getElementById('Result3')?.value) || 0;
  const minForce = parseFloat(document.getElementById('MinPullForce')?.value) || 0;
  const resultsAccepted = document.getElementById('ResultsAccepted');
  if (!resultsAccepted) return;
  resultsAccepted.value = (r1 >= minForce && r2 >= minForce && r3 >= minForce) ? 0 : 1;
  updateReactInput(resultsAccepted, resultsAccepted.value);
}


// ===== 8. updateInputToDropdown Function =====
// Copies options from the current page's Pull Tester dropdown.
function updateInputToDropdown() {
  const sourceSelect = document.querySelector('select[name="tests.[0].pull_tester"]');
  if (sourceSelect) {
    const options = Array.from(sourceSelect.options).map(opt => ({
      value: opt.value,
      text: opt.text
    }));
    const targetSelect = document.getElementById('PullTesterID');
    if (targetSelect) {
      targetSelect.innerHTML = ''; // Clear existing options.
      options.forEach(({ text, value }) => {
        const option = document.createElement('option');
        option.value = value;
        option.innerText = text;
        targetSelect.appendChild(option);
      });
    }
  } else {
    console.warn('Source select element for Pull Tester ID not found');
  }
}


// ===== 9. Expand Component Lines Functionality =====
const pressExpandBtn = () => {
  const expandBtn = document.getElementById('expandBtn');
  if (!expandBtn) {
    console.warn('Expand button not found.');
    return;
  }
  expandBtn.classList.toggle('fa-chevron-up');
  expandBtn.classList.toggle('fa-chevron-down');
  // Simulate expanding/collapsing rows – adjust the selector as needed.
  const rows = document.querySelectorAll('#headingOne .btn');
  rows.forEach(row => row.click());
};

const addExpandBtnListener = () => {
  const btn = document.getElementById('expandBtn');
  if (btn && !btn.dataset.listenerAdded) {
    btn.addEventListener('click', pressExpandBtn);
    btn.dataset.listenerAdded = true;
  }
};


// ===== 10. Append Sidebar and Toggle Button =====
const appendSidebar = () => {
  if (window.location.href.includes('/intranet#/pull-test/add')) {
    // Append sidebar to .app-body if it exists; otherwise, to document.body.
    const appBody = document.querySelector('.app-body');
    if (appBody) {
      if (!document.getElementById('my-sidebar')) {
        const sidebar = Sidebar.create();
        appBody.appendChild(sidebar);
        createInputBoxes();
        addExpandBtnListener();
      }
    } else {
      if (!document.getElementById('my-sidebar')) {
        const sidebar = Sidebar.create();
        document.body.appendChild(sidebar);
        createInputBoxes();
        addExpandBtnListener();
      }
    }
    // Create the toggle button and always insert it before the navbar.
    if (!document.getElementById('toggle-button')) {
      const toggleButton = document.createElement('button');
      toggleButton.id = 'toggle-button';
      toggleButton.className = 'btn ml-2 mr-2 btn-light';
      toggleButton.innerHTML = 'Pull Test Tool <i id="chevronIcon" class="ml-1 fa fa-chevron-left"></i>';
      toggleButton.style.width = '200px';
      toggleButton.addEventListener('click', Sidebar.toggle);
      const navbarNav = document.querySelector('ul.navbar-nav');
      navbarNav.parentNode.insertBefore(toggleButton, navbarNav);
    }
  } else {
    // Remove sidebar and toggle button if not on the target URL.
    document.getElementById('my-sidebar')?.remove();
    document.getElementById('toggle-button')?.remove();
  }
};


// ===== 11. Observe DOM Changes and URL History =====
const observer = new MutationObserver(() => {
  appendSidebar();
});
observer.observe(document.body, { childList: true, subtree: true });

const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;
history.pushState = function (...args) {
  originalPushState.apply(this, args);
  appendSidebar();
};
history.replaceState = function (...args) {
  originalReplaceState.apply(this, args);
  appendSidebar();
};
window.addEventListener('popstate', appendSidebar);


// ===== 12. Initial Call =====
appendSidebar();
