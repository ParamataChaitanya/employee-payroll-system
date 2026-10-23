// ==========================================
// PayMaster Pro - Frontend Application Logic
// ==========================================

const API_BASE = window.location.origin.includes('8080') 
  ? window.location.origin 
  : 'http://localhost:8080';

let employeesData = [];
let currentSalaries = {};
let auditLogs = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  recalcLiveMath();
  logAudit('SYSTEM_INIT', 'Application frontend initialized successfully. Connected to ' + API_BASE);
});

// View Navigation
function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item button').forEach(btn => btn.classList.remove('active'));

  const targetSection = document.getElementById(`view-${viewId}`);
  const targetNav = document.getElementById(`nav-${viewId}`);
  if (targetSection) targetSection.classList.add('active');
  if (targetNav) targetNav.classList.add('active');

  const titles = {
    dashboard: { title: 'Overview & KPI Dashboard', sub: 'Real-time statistics across active staff, transactions, and payroll status' },
    employees: { title: 'Employee Master Directory (Module 1)', sub: 'Manage corporate employee records with relational integrity validation' },
    payroll: { title: 'Payroll Processing Engine (Module 2 & 3)', sub: 'ACID transactional salary computation with mathematical verification' },
    payslip: { title: 'Payslip Generation & SOAP Service (Module 4)', sub: 'Contract-first XML web services and printable corporate salary slips' },
    audit: { title: 'Spring AOP Live Audit Stream (Module 3)', sub: 'Non-intrusive method interception, execution timings, and commit/rollback logs' }
  };

  if (titles[viewId]) {
    document.getElementById('viewHeading').innerText = titles[viewId].title;
    document.getElementById('viewSubheading').innerText = titles[viewId].sub;
  }
}

// Fetch All Employees & Populate Views
async function fetchData() {
  try {
    const res = await fetch(`${API_BASE}/api/employees`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    
    if (json.success && Array.isArray(json.data)) {
      employeesData = json.data;
      renderDashboard();
      renderEmployeesTable();
      populateSelectDropdowns();
      document.getElementById('backendStatusText').innerText = 'Backend Online (8080)';
    }
  } catch (err) {
    console.error('Fetch error:', err);
    showToast('Failed to connect to backend: ' + err.message, 'danger');
    document.getElementById('backendStatusText').innerText = 'Connection Error';
  }
}

// Render Dashboard
function renderDashboard() {
  document.getElementById('dashTotalEmp').innerText = employeesData.length;
  
  const depts = new Set(employeesData.map(e => e.department).filter(Boolean));
  document.getElementById('dashDepts').innerText = depts.size;

  // Recent preview table
  const tbody = document.getElementById('dashEmpTableBody');
  tbody.innerHTML = '';

  employeesData.slice(0, 5).forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="display: flex; align-items: center;">
          <span class="avatar">${getInitials(emp.employeeName)}</span>
          <div>
            <strong>${escapeHtml(emp.employeeName)}</strong>
            <div style="font-size: 0.78rem; color: var(--text-sub);">${escapeHtml(emp.email)}</div>
          </div>
        </div>
      </td>
      <td>${escapeHtml(emp.department)}</td>
      <td>${escapeHtml(emp.designation || 'Staff')}</td>
      <td><span class="badge ${emp.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}">${emp.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Employees Table (Module 1)
function renderEmployeesTable(filtered = employeesData) {
  const tbody = document.getElementById('employeesTableBody');
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-sub); padding: 2rem;">No employee records found.</td></tr>`;
    return;
  }

  filtered.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${emp.employeeId}</td>
      <td>
        <div style="display: flex; align-items: center;">
          <span class="avatar">${getInitials(emp.employeeName)}</span>
          <div>
            <strong>${escapeHtml(emp.employeeName)}</strong>
            <div style="font-size: 0.78rem; color: var(--text-sub);">${escapeHtml(emp.email)}</div>
          </div>
        </div>
      </td>
      <td>${escapeHtml(emp.department)}</td>
      <td>${escapeHtml(emp.designation || 'N/A')}</td>
      <td>${escapeHtml(emp.phone || '-')}</td>
      <td><span class="badge ${emp.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}">${emp.status}</span></td>
      <td style="text-align: right;">
        <button class="btn btn-secondary btn-sm" onclick="quickPay(${emp.employeeId})" title="Calculate Pay">Pay</button>
        <button class="btn btn-secondary btn-sm" onclick="viewHistory(${emp.employeeId})" title="Salary History">History</button>
        <button class="btn btn-secondary btn-sm" onclick="openEditEmployeeModal(${emp.employeeId})" title="Edit">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${emp.employeeId})" title="Delete">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Populate Select Dropdowns
function populateSelectDropdowns() {
  const deptSelect = document.getElementById('departmentFilter');
  const calcSelect = document.getElementById('calcEmployeeSelect');
  const payslipSelect = document.getElementById('payslipEmpSelect');

  // Departments
  const depts = Array.from(new Set(employeesData.map(e => e.department).filter(Boolean)));
  deptSelect.innerHTML = '<option value="">All Departments</option>';
  depts.forEach(d => {
    deptSelect.innerHTML += `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`;
  });

  // Employee Dropdowns
  calcSelect.innerHTML = '<option value="">-- Choose Staff Member --</option>';
  payslipSelect.innerHTML = '<option value="">-- Select Staff Member --</option>';

  employeesData.forEach(e => {
    const opt = `<option value="${e.employeeId}">${escapeHtml(e.employeeName)} (#${e.employeeId} - ${escapeHtml(e.department)})</option>`;
    calcSelect.innerHTML += opt;
    payslipSelect.innerHTML += opt;
  });

  if (employeesData.length > 0 && !calcSelect.value) {
    calcSelect.value = employeesData[0].employeeId;
    payslipSelect.value = employeesData[0].employeeId;
    loadEmployeePayslip();
  }
}

// Filter Employees
function filterEmployees() {
  const search = document.getElementById('employeeSearchInput').value.toLowerCase();
  const dept = document.getElementById('departmentFilter').value;

  const filtered = employeesData.filter(e => {
    const matchSearch = e.employeeName.toLowerCase().includes(search) || 
                        e.email.toLowerCase().includes(search) ||
                        (e.department && e.department.toLowerCase().includes(search));
    const matchDept = !dept || e.department === dept;
    return matchSearch && matchDept;
  });

  renderEmployeesTable(filtered);
}

// Add / Edit Employee Modals
function openAddEmployeeModal() {
  document.getElementById('modalEmpTitle').innerText = 'Register New Employee';
  document.getElementById('editEmployeeId').value = '';
  document.getElementById('addEmployeeForm').reset();
  openModal('addEmployeeModal');
}

function openEditEmployeeModal(id) {
  const emp = employeesData.find(e => e.employeeId === id);
  if (!emp) return;

  document.getElementById('modalEmpTitle').innerText = 'Update Employee Profile';
  document.getElementById('editEmployeeId').value = emp.employeeId;
  document.getElementById('formEmpName').value = emp.employeeName;
  document.getElementById('formEmpDept').value = emp.department;
  document.getElementById('formEmpEmail').value = emp.email;
  document.getElementById('formEmpDesignation').value = emp.designation || '';
  document.getElementById('formEmpPhone').value = emp.phone || '';
  document.getElementById('formEmpStatus').value = emp.status || 'ACTIVE';

  openModal('addEmployeeModal');
}

async function handleEmployeeFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('editEmployeeId').value;
  const payload = {
    employeeName: document.getElementById('formEmpName').value.trim(),
    department: document.getElementById('formEmpDept').value.trim(),
    email: document.getElementById('formEmpEmail').value.trim(),
    designation: document.getElementById('formEmpDesignation').value.trim(),
    phone: document.getElementById('formEmpPhone').value.trim(),
    status: document.getElementById('formEmpStatus').value
  };

  const isEdit = !!id;
  const url = isEdit ? `${API_BASE}/api/employees/${id}` : `${API_BASE}/api/employees`;
  const method = isEdit ? 'PUT' : 'POST';

  try {
    logAudit('AOP_BEFORE', `Invoking EmployeeService.${isEdit ? 'updateEmployee' : 'createEmployee'} with payload: ${payload.email}`);
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      logAudit('AOP_EXCEPTION', `Operation failed with HTTP ${res.status}: ${data.message || 'Validation error'}`);
      throw new Error(data.message || (data.details ? data.details.join(', ') : 'Request failed'));
    }

    logAudit('AOP_SUCCESS', `Employee ${isEdit ? 'updated' : 'registered'} successfully with ID: ${data.data?.employeeId}`);
    showToast(data.message || 'Saved successfully', 'success');
    closeModal('addEmployeeModal');
    await fetchData();
  } catch (err) {
    showToast(err.message, 'danger');
  }
}

async function deleteEmployee(id) {
  if (!confirm(`Are you sure you want to delete employee #${id}? This will cascade delete associated salary records.`)) return;

  try {
    logAudit('AOP_BEFORE', `Invoking EmployeeService.deleteEmployee(${id})`);
    const res = await fetch(`${API_BASE}/api/employees/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) {
      logAudit('AOP_EXCEPTION', `Failed to delete employee #${id}`);
      throw new Error(data.message || 'Deletion failed');
    }

    logAudit('AOP_SUCCESS', `Successfully deleted employee #${id}`);
    showToast('Employee deleted successfully', 'success');
    await fetchData();
  } catch (err) {
    showToast(err.message, 'danger');
  }
}

// Live Math Recalculation for Payroll Engine
function recalcLiveMath() {
  const basic = parseFloat(document.getElementById('calcBasic').value) || 0;
  const hra = parseFloat(document.getElementById('calcHra').value) || 0;
  const allowances = parseFloat(document.getElementById('calcAllowances').value) || 0;
  const deductions = parseFloat(document.getElementById('calcDeductions').value) || 0;

  const gross = basic + hra + allowances;
  const netPay = gross - deductions;

  document.getElementById('previewBasic').innerText = formatCurrency(basic);
  document.getElementById('previewHra').innerText = formatCurrency(hra);
  document.getElementById('previewAllowances').innerText = formatCurrency(allowances);
  document.getElementById('previewGross').innerText = formatCurrency(gross);
  document.getElementById('previewDeductions').innerText = formatCurrency(deductions);
  document.getElementById('previewNetPay').innerText = formatCurrency(netPay);

  const warnEl = document.getElementById('calcDeductionWarning');
  if (deductions > gross) {
    warnEl.classList.add('active');
  } else {
    warnEl.classList.remove('active');
  }
}

function quickPay(id) {
  switchView('payroll');
  document.getElementById('calcEmployeeSelect').value = id;
  handleCalcEmployeeChange();
}

function handleCalcEmployeeChange() {
  const id = document.getElementById('calcEmployeeSelect').value;
  if (!id) return;
  // Sync with payslip view
  document.getElementById('payslipEmpSelect').value = id;
}

// Handle Payroll Calculation & Persistence (Module 2 & 3)
async function handlePayrollSubmit(e) {
  e.preventDefault();
  const empId = document.getElementById('calcEmployeeSelect').value;
  if (!empId) {
    showToast('Please select an employee first', 'warning');
    return;
  }

  const payload = {
    payPeriod: document.getElementById('calcPayPeriod').value.trim(),
    basicSalary: parseFloat(document.getElementById('calcBasic').value) || 0,
    hra: parseFloat(document.getElementById('calcHra').value) || 0,
    allowances: parseFloat(document.getElementById('calcAllowances').value) || 0,
    deductions: parseFloat(document.getElementById('calcDeductions').value) || 0
  };

  const startTime = performance.now();
  logAudit('AOP_BEFORE', `[TX BEGIN] calculateAndProcessSalary for empId: ${empId}, period: ${payload.payPeriod}`);

  try {
    const res = await fetch(`${API_BASE}/api/payroll/calculate/${empId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const elapsed = Math.round(performance.now() - startTime);
    const data = await res.json();

    if (!res.ok) {
      logAudit('AOP_ROLLBACK', `[TRANSACTION ROLLBACK] Error: ${data.message} (took ${elapsed}ms)`);
      throw new Error(data.message || 'Payroll calculation rejected');
    }

    logAudit('AOP_COMMIT', `[TRANSACTION COMMIT] Salary persisted. Gross: ₹${data.data.grossSalary}, Net: ₹${data.data.netPay} (took ${elapsed}ms)`);
    showToast(`Payroll committed successfully for ${data.data.payPeriod}! Net Pay: ₹${data.data.netPay}`, 'success');
    
    // Update dashboard outflow
    document.getElementById('dashDisbursement').innerText = formatCurrency(data.data.netPay);
    
    // Sync payslip
    loadEmployeePayslip();
  } catch (err) {
    showToast(err.message, 'danger');
  }
}

// Rollback Demo Helper
function triggerRollbackDemo() {
  document.getElementById('calcBasic').value = '20000';
  document.getElementById('calcHra').value = '5000';
  document.getElementById('calcAllowances').value = '3000';
  document.getElementById('calcDeductions').value = '50000';
  recalcLiveMath();
  showToast('Set Deductions (₹50,000) > Gross (₹28,000). Click Calculate to trigger rollback!', 'warning');
}

// View Salary History Modal
async function viewHistory(id) {
  const emp = employeesData.find(e => e.employeeId === id);
  document.getElementById('historyModalTitle').innerText = `Salary History: ${emp ? emp.employeeName : '#' + id}`;
  
  const tbody = document.getElementById('historyTableBody');
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Fetching history...</td></tr>';
  openModal('salaryHistoryModal');

  try {
    const res = await fetch(`${API_BASE}/api/payroll/employee/${id}`);
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      tbody.innerHTML = '';
      data.data.forEach(sal => {
        tbody.innerHTML += `
          <tr>
            <td><strong>${sal.payPeriod}</strong></td>
            <td>₹${sal.grossSalary.toLocaleString()}</td>
            <td style="color: #f87171;">₹${sal.deductions.toLocaleString()}</td>
            <td style="color: #38bdf8; font-weight: 700;">₹${sal.netPay.toLocaleString()}</td>
            <td style="font-size: 0.78rem; color: var(--text-sub);">${sal.processedDate ? sal.processedDate.substring(0, 10) : '-'}</td>
          </tr>
        `;
      });
    } else {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-sub);">No historical payroll records found for this employee.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color: #f87171; text-align: center;">Error loading history: ${err.message}</td></tr>`;
  }
}

// Load Employee Payslip (Module 4)
async function loadEmployeePayslip() {
  const empId = document.getElementById('payslipEmpSelect').value;
  const period = document.getElementById('payslipPeriodInput').value.trim() || '10-2026';
  if (!empId) return;

  const emp = employeesData.find(e => e.employeeId == empId);
  if (emp) {
    document.getElementById('psEmpId').innerText = `#${emp.employeeId}`;
    document.getElementById('psEmpName').innerText = emp.employeeName;
    document.getElementById('psEmpEmail').innerText = emp.email;
    document.getElementById('psDept').innerText = emp.department;
    document.getElementById('psDesignation').innerText = emp.designation || 'Staff';
    document.getElementById('psPayPeriod').innerText = `Pay Period: ${period}`;
  }

  // Update SOAP sample code box with selected IDs
  document.getElementById('soapReqBox').innerText = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://example.com/payroll/soap">
    <soapenv:Header/>
    <soapenv:Body>
        <soap:getPayslipRequest>
            <soap:employeeId>${empId}</soap:employeeId>
            <soap:payPeriod>${period}</soap:payPeriod>
        </soap:getPayslipRequest>
    </soapenv:Body>
</soapenv:Envelope>`;

  // Try to fetch actual salary for this period
  try {
    const res = await fetch(`${API_BASE}/api/payroll/employee/${empId}/period/${period}`);
    const data = await res.json();

    if (data.success && data.data) {
      const s = data.data;
      document.getElementById('psBasic').innerText = s.basicSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('psHra').innerText = s.hra.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('psAllowances').innerText = s.allowances.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('psDeductions').innerText = s.deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('psGross').innerText = '₹' + s.grossSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('psTotalDeductions').innerText = '₹' + s.deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('psNetPay').innerText = '₹' + s.netPay.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('psGenDate').innerText = s.processedDate ? s.processedDate.replace('T', ' ').substring(0, 19) : 'N/A';
    }
  } catch (err) {
    // Keep placeholder values if no record yet
  }
}

// Direct SOAP XML Execution
async function sendSoapRequestDirectly() {
  const reqXml = document.getElementById('soapReqBox').innerText;
  const resBox = document.getElementById('soapResBox');
  resBox.innerText = 'Connecting to SOAP endpoint at /ws...';

  logAudit('AOP_BEFORE', 'Sending SOAP 1.1 Envelope to /ws (Action: getPayslipRequest)');

  try {
    const res = await fetch(`${API_BASE}/ws`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml;charset=UTF-8' },
      body: reqXml
    });

    const xmlText = await res.text();
    resBox.innerText = formatXml(xmlText);

    if (res.ok) {
      logAudit('AOP_SUCCESS', 'SOAP Response 200 OK received with GetPayslipResponse schema payload');
      showToast('SOAP Web Service call executed successfully!', 'success');
    } else {
      logAudit('AOP_EXCEPTION', 'SOAP Fault returned from MessageDispatcherServlet');
      showToast('SOAP Fault returned by server', 'warning');
    }
  } catch (err) {
    resBox.innerText = 'SOAP Request Failed: ' + err.message;
    showToast('Failed to execute SOAP call: ' + err.message, 'danger');
  }
}

function toggleSoapTester() {
  const el = document.getElementById('soapTesterCard');
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// AOP Live Audit Stream (Module 3)
function logAudit(type, message) {
  const stream = document.getElementById('auditLiveStream');
  if (!stream) return;

  const time = new Date().toLocaleTimeString();
  const div = document.createElement('div');
  div.className = 'audit-item';

  let badgeClass = 'audit-entry';
  let badgeLabel = type;

  if (type === 'AOP_COMMIT') { badgeClass = 'audit-commit'; badgeLabel = 'COMMIT'; }
  else if (type === 'AOP_ROLLBACK' || type === 'AOP_EXCEPTION') { badgeClass = 'audit-rollback'; badgeLabel = 'ROLLBACK'; }
  else if (type === 'AOP_SUCCESS') { badgeClass = 'audit-commit'; badgeLabel = 'SUCCESS'; }

  div.innerHTML = `
    <span style="color: var(--text-sub); font-family: monospace; font-size: 0.78rem;">${time}</span>
    <span class="audit-badge ${badgeClass}">${badgeLabel}</span>
    <span style="color: var(--text-main);">${escapeHtml(message)}</span>
  `;

  stream.insertBefore(div, stream.firstChild);

  // Keep max 50 items
  while (stream.children.length > 50) {
    stream.removeChild(stream.lastChild);
  }
}

function clearAuditLog() {
  document.getElementById('auditLiveStream').innerHTML = '';
}

// Modal Helpers
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Utilities
function formatCurrency(val) {
  return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getInitials(name) {
  if (!name) return 'EP';
  const parts = name.trim().split(' ');
  return parts.length > 1 
    ? (parts[0][0] + parts[1][0]).toUpperCase() 
    : parts[0].substring(0, 2).toUpperCase();
}

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function formatXml(xml) {
  let formatted = '';
  let pad = 0;
  xml.split(/>\s*</).forEach(node => {
    let indent = 0;
    if (node.match(/^\/\w/)) pad = Math.max(0, pad - 1);
    else if (node.match(/^<?\w[^>]*[^\/]$/)) indent = 1;
    formatted += '  '.repeat(pad) + '<' + node + '>\n';
    pad += indent;
  });
  return formatted.trim();
}
