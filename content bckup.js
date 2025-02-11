const inputBoxes = [
  {
    InputType: 'checkbox',
    ID: 'CrimpHeightNA',
    InputText: 'Crimp Height Not Applicable',
    value: true,
    InputTarget: '[name$=".inline_crimp_height"]'
  },
  {
    InputType: 'dropDown',
    ID: 'PullTesterID',
    InputText: 'Pull Tester ID',
    InputTarget: '[name$=".pull_tester"]'
  },
  {
    InputType: 'number',
    ID: 'WireAWG',
    InputText: 'Wire AWG',
    InputTarget: '[name$=".wire_awg"]'
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
    InputTarget: '[name$=".wire_spec"]'
  },
  {
    InputType: 'number',
    ID: 'Result1',
    InputText: 'Test Result 1',
    InputTarget: '[name$=".test_1"]'
  },
  {
    InputType: 'number',
    ID: 'Result2',
    InputText: 'Test Result 2',
    InputTarget: '[name$=".test_2"]'
  },
  {
    InputType: 'number',
    ID: 'Result3',
    InputText: 'Test Result 3',
    InputTarget: '[name$=".test_3"]'
  },
  {
    InputType: 'dropDown',
    ID: 'ResultsAccepted',
    InputText: 'Result',
    value: 0,
    InputTarget: '[name$=".pull_test_status"]',
    Selections: [
      { text: 'Accepted', value: 0 },
      { text: 'Rejected', value: 1 }
    ]
  }
];

const Sidebar = (() => {
  const create = () => {
    const sidebar = document.createElement('div');
    sidebar.id = 'my-sidebar';
    sidebar.classList.add('sidebar', 'pt-3');
    sidebar.innerHTML = `
      <div class="pl-3 pr-3">
        <h2>Pull Test Helper</h2>
        <span class="ml-2 mr-2">Expand Component Lines<i id="expandBtn" class="ml-2 btn btn-light fa fa-chevron-down"></i></span>
        <div class="result-inputs mt-3"></div>
      </div>
    `;
    return sidebar;
  };

  const toggle = () => {
    const sidebar = document.querySelector('#my-sidebar');
    const sidebarOpen = sidebar?.style.width === '300px';

    if (sidebar) {
      sidebar.style.width = sidebarOpen ? '0px' : '300px';
      const chevronIcon = document.getElementById('chevronIcon');
      chevronIcon.classList.toggle('fa-chevron-right');
      chevronIcon.classList.toggle('fa-chevron-left');
    }
  };

  return { create, toggle };
})();

const appendSidebar = () => {
  if (window.location.href.includes('/intranet#/pull-test/add')) {
    if (!document.querySelector('#my-sidebar')) {
      const sidebar = Sidebar.create();
      document.body.appendChild(sidebar);
      createInputBoxes();
    }
  }
};

const fillPullTestLog = () => {
  if (!window.location.href.includes('/intranet#/pull-test/add')) return; // Ensure function runs only on the correct page

  document.querySelectorAll('.mb-0.card').forEach(record => {
    const recordIdElement = Array.from(record.querySelectorAll('.card-header span'))
      .find(span => span.innerText.includes('Record ID: New'));

    if (!recordIdElement) return;

    inputBoxes.forEach(({ InputType, ID, InputTarget }) => {
      const inputElements = record.querySelectorAll(InputTarget);
      if (!inputElements.length) return;

      const inputValue = document.getElementById(ID)?.value;

      switch (InputType) {
        case 'checkbox':
          inputElements.forEach(checkbox => {
            if (inputValue && checkbox.checked) checkbox.click();
          });
          break;
        case 'text':
        case 'number':
        case 'dropDown':
          inputElements.forEach(target => updateReactInput(target, inputValue));
          break;
      }
    });
  });
};

function updateReactInput(target, value) {
  target.value = value;
  target.dispatchEvent(new Event('input', { bubbles: true }));
  target.dispatchEvent(new Event('change', { bubbles: true }));
}

document.getElementById('update-values-button')?.addEventListener('click', fillPullTestLog);

const createInputBoxes = () => {
  inputBoxes.forEach(({ InputType, ID, InputText }) => {
    const label = document.createElement('label');
    label.innerHTML = `<b>${InputText}</b>`;

    let inputField;
    if (InputType === 'text' || InputType === 'number') {
      inputField = document.createElement('input');
      inputField.type = InputType;
    } else if (InputType === 'checkbox') {
      inputField = document.createElement('input');
      inputField.type = 'checkbox';
    } else if (InputType === 'dropDown') {
      inputField = document.createElement('select');
    }

    inputField.id = ID;
    inputField.classList.add('form-control');

    const inputGroup = document.createElement('div');
    inputGroup.classList.add('input-group', 'mt-3');
    inputGroup.appendChild(label);
    inputGroup.appendChild(inputField);

    document.querySelector('.result-inputs').appendChild(inputGroup);
  });

  const updateValuesBtn = document.createElement('button');
  updateValuesBtn.id = 'update-values-button';
  updateValuesBtn.className = 'btn btn-primary m-2';
  updateValuesBtn.innerText = 'Update Values';
  updateValuesBtn.addEventListener('click', fillPullTestLog);
  document.querySelector('#my-sidebar').appendChild(updateValuesBtn);
};

const observer = new MutationObserver(() => appendSidebar());
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

appendSidebar();
