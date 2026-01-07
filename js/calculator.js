// 숫자 포맷팅 함수 (천 단위 콤마)
function formatNumber(num) {
    return Math.round(num).toLocaleString('ko-KR');
}

// 숫자를 원화로 포맷팅
function formatCurrency(num) {
    return formatNumber(num) + '원';
}

// 퍼센트 포맷팅
function formatPercent(num) {
    return num.toFixed(4) + '%';
}

// 대출 계산 메인 함수
function calculateLoan() {
    // 입력값 가져오기
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanPeriod = parseInt(document.getElementById('loanPeriod').value);
    const paymentType = document.getElementById('paymentType').value;

    // 유효성 검사
    if (isNaN(loanAmount) || loanAmount <= 0) {
        alert('올바른 대출 금액을 입력해주세요.');
        return;
    }
    if (isNaN(interestRate) || interestRate < 0) {
        alert('올바른 이자율을 입력해주세요.');
        return;
    }
    if (isNaN(loanPeriod) || loanPeriod <= 0) {
        alert('올바른 대출 기간을 입력해주세요.');
        return;
    }

    // 월 이자율 계산
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = loanPeriod * 12;

    let result;
    if (paymentType === 'equal') {
        // 원리금균등상환
        result = calculateEqualPayment(loanAmount, monthlyRate, totalMonths);
    } else {
        // 원금균등상환
        result = calculateEqualPrincipal(loanAmount, monthlyRate, totalMonths);
    }

    // 결과 표시
    displayResults(result, loanAmount, monthlyRate, totalMonths);
}

// 원리금균등상환 계산
function calculateEqualPayment(principal, monthlyRate, months) {
    let monthlyPayment;

    if (monthlyRate === 0) {
        // 이자율이 0%인 경우
        monthlyPayment = principal / months;
    } else {
        // 원리금균등상환 공식: P * r * (1+r)^n / ((1+r)^n - 1)
        monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months)
                        / (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    // 상환 스케줄 생성
    const schedule = [];
    let remainingBalance = principal;

    for (let i = 1; i <= Math.min(12, months); i++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        schedule.push({
            month: i,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance: Math.max(0, remainingBalance)
        });
    }

    return {
        monthlyPayment,
        totalPayment,
        totalInterest,
        schedule,
        isFixed: true // 원리금균등은 월 상환금이 고정
    };
}

// 원금균등상환 계산
function calculateEqualPrincipal(principal, monthlyRate, months) {
    const principalPayment = principal / months;
    const schedule = [];
    let remainingBalance = principal;
    let totalPayment = 0;

    for (let i = 1; i <= Math.min(12, months); i++) {
        const interestPayment = remainingBalance * monthlyRate;
        const monthlyPayment = principalPayment + interestPayment;
        totalPayment += monthlyPayment;
        remainingBalance -= principalPayment;

        schedule.push({
            month: i,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance: Math.max(0, remainingBalance)
        });
    }

    // 전체 기간의 총 상환금액 계산
    remainingBalance = principal;
    let totalInterest = 0;
    for (let i = 1; i <= months; i++) {
        totalInterest += remainingBalance * monthlyRate;
        remainingBalance -= principalPayment;
    }

    const fullTotalPayment = principal + totalInterest;
    const firstMonthPayment = schedule[0].payment;

    return {
        monthlyPayment: firstMonthPayment,
        totalPayment: fullTotalPayment,
        totalInterest: totalInterest,
        schedule,
        isFixed: false // 원금균등은 월 상환금이 변동
    };
}

// 결과 표시 함수
function displayResults(result, principal, monthlyRate, totalMonths) {
    // 결과 섹션 표시
    document.getElementById('resultSection').style.display = 'block';

    // 주요 결과 표시
    const monthlyPaymentText = result.isFixed
        ? formatCurrency(result.monthlyPayment)
        : formatCurrency(result.monthlyPayment) + ' (첫달 기준)';

    document.getElementById('monthlyPayment').textContent = monthlyPaymentText;
    document.getElementById('totalPayment').textContent = formatCurrency(result.totalPayment);
    document.getElementById('totalInterest').textContent = formatCurrency(result.totalInterest);

    // 상세 정보 표시
    document.getElementById('principalAmount').textContent = formatCurrency(principal);
    document.getElementById('totalMonths').textContent = totalMonths + '개월';
    document.getElementById('monthlyRate').textContent = formatPercent(monthlyRate * 100);

    // 상환 스케줄 표시
    displaySchedule(result.schedule);

    // 결과로 스크롤
    document.getElementById('resultSection').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

// 상환 스케줄 테이블 표시
function displaySchedule(schedule) {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    schedule.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.month}개월</td>
            <td>${formatCurrency(row.payment)}</td>
            <td>${formatCurrency(row.principal)}</td>
            <td>${formatCurrency(row.interest)}</td>
            <td>${formatCurrency(row.balance)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 적금 계산 메인 함수
function calculateSavings() {
    // 입력값 가져오기
    const monthlyDeposit = parseFloat(document.getElementById('monthlyDeposit').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const savingsPeriod = parseInt(document.getElementById('savingsPeriod').value);
    const interestType = document.getElementById('interestType').value;
    const taxRate = parseFloat(document.getElementById('taxRate').value);

    // 유효성 검사
    if (isNaN(monthlyDeposit) || monthlyDeposit <= 0) {
        alert('올바른 월 납입액을 입력해주세요.');
        return;
    }
    if (isNaN(interestRate) || interestRate < 0) {
        alert('올바른 이자율을 입력해주세요.');
        return;
    }
    if (isNaN(savingsPeriod) || savingsPeriod <= 0) {
        alert('올바른 적금 기간을 입력해주세요.');
        return;
    }
    if (isNaN(taxRate) || taxRate < 0) {
        alert('올바른 세율을 입력해주세요.');
        return;
    }

    // 월 이자율 계산
    const monthlyRate = interestRate / 12 / 100;

    let result;
    if (interestType === 'simple') {
        // 단리 계산
        result = calculateSimpleInterestSavings(monthlyDeposit, monthlyRate, savingsPeriod);
    } else {
        // 월복리 계산
        result = calculateCompoundInterestSavings(monthlyDeposit, monthlyRate, savingsPeriod);
    }

    // 세후 금액 계산
    const taxAmount = result.totalInterest * (taxRate / 100);
    const afterTaxInterest = result.totalInterest - taxAmount;
    const finalAmount = result.totalPrincipal + afterTaxInterest;

    // 실질 수익률 계산 (연환산)
    const realReturn = (afterTaxInterest / result.totalPrincipal) * (12 / savingsPeriod) * 100;

    // 결과 표시
    displaySavingsResults({
        ...result,
        taxAmount,
        afterTaxInterest,
        finalAmount,
        realReturn
    });
}

// 단리 적금 계산
function calculateSimpleInterestSavings(monthlyDeposit, monthlyRate, months) {
    const totalPrincipal = monthlyDeposit * months;

    // 단리 이자 계산: 월 납입액 × 월 이자율 × (n + n-1 + ... + 1)
    // = 월 납입액 × 월 이자율 × n(n+1)/2
    const totalInterest = monthlyDeposit * monthlyRate * (months * (months + 1) / 2);

    // 월별 스케줄 생성
    const schedule = [];
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;

    for (let i = 1; i <= months; i++) {
        cumulativePrincipal += monthlyDeposit;

        // 이번 달까지의 총 이자 계산
        // 각 회차별로 납입된 금액이 남은 기간만큼 이자 발생
        let interestThisMonth = 0;
        for (let j = 1; j <= i; j++) {
            // j번째 회차 납입금이 (i - j + 1)개월 동안 이자 발생
            interestThisMonth += monthlyDeposit * monthlyRate;
        }

        // 이번 달 발생한 이자만 계산
        const monthlyInterest = cumulativePrincipal * monthlyRate;
        cumulativeInterest += monthlyInterest;

        schedule.push({
            month: i,
            deposit: monthlyDeposit,
            monthlyInterest: monthlyInterest,
            cumulativePrincipal: cumulativePrincipal,
            cumulativeBalance: cumulativePrincipal + cumulativeInterest
        });
    }

    return {
        totalPrincipal,
        totalInterest,
        beforeTaxAmount: totalPrincipal + totalInterest,
        schedule
    };
}

// 월복리 적금 계산
function calculateCompoundInterestSavings(monthlyDeposit, monthlyRate, months) {
    const totalPrincipal = monthlyDeposit * months;

    // 월별 스케줄 생성
    const schedule = [];
    let balance = 0;

    for (let i = 1; i <= months; i++) {
        // 이전 잔액에 이자 발생
        const interest = balance * monthlyRate;
        balance += interest;

        // 이번 달 납입
        balance += monthlyDeposit;

        schedule.push({
            month: i,
            deposit: monthlyDeposit,
            monthlyInterest: interest,
            cumulativePrincipal: monthlyDeposit * i,
            cumulativeBalance: balance
        });
    }

    const totalInterest = balance - totalPrincipal;

    return {
        totalPrincipal,
        totalInterest,
        beforeTaxAmount: balance,
        schedule
    };
}

// 적금 결과 표시 함수
function displaySavingsResults(result) {
    // 결과 섹션 표시
    document.getElementById('resultSection').style.display = 'block';

    // 주요 결과 표시
    document.getElementById('finalAmount').textContent = formatCurrency(result.finalAmount);
    document.getElementById('totalPrincipal').textContent = formatCurrency(result.totalPrincipal);
    document.getElementById('totalInterest').textContent = formatCurrency(result.totalInterest);

    // 상세 정보 표시
    document.getElementById('beforeTaxAmount').textContent = formatCurrency(result.beforeTaxAmount);
    document.getElementById('taxAmount').textContent = formatCurrency(result.taxAmount);
    document.getElementById('afterTaxInterest').textContent = formatCurrency(result.afterTaxInterest);
    document.getElementById('realReturn').textContent = result.realReturn.toFixed(2) + '%';

    // 적립 스케줄 표시
    displaySavingsSchedule(result.schedule);

    // 결과로 스크롤
    document.getElementById('resultSection').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

// 적립 스케줄 테이블 표시
function displaySavingsSchedule(schedule) {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    schedule.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.month}개월</td>
            <td>${formatCurrency(row.deposit)}</td>
            <td>${formatCurrency(row.monthlyInterest)}</td>
            <td>${formatCurrency(row.cumulativePrincipal)}</td>
            <td>${formatCurrency(row.cumulativeBalance)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 투자 수익률 계산 메인 함수
function calculateInvestment() {
    // 입력값 가져오기
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value);
    const annualReturn = parseFloat(document.getElementById('annualReturn').value);
    const investmentPeriod = parseInt(document.getElementById('investmentPeriod').value);
    const compoundFrequency = document.getElementById('compoundFrequency').value;

    // 유효성 검사
    if (isNaN(initialInvestment) || initialInvestment < 0) {
        alert('올바른 초기 투자금을 입력해주세요.');
        return;
    }
    if (isNaN(monthlyInvestment) || monthlyInvestment < 0) {
        alert('올바른 월 투자금을 입력해주세요.');
        return;
    }
    if (initialInvestment === 0 && monthlyInvestment === 0) {
        alert('초기 투자금 또는 월 투자금 중 하나는 0보다 커야 합니다.');
        return;
    }
    if (isNaN(annualReturn)) {
        alert('올바른 수익률을 입력해주세요.');
        return;
    }
    if (isNaN(investmentPeriod) || investmentPeriod <= 0) {
        alert('올바른 투자 기간을 입력해주세요.');
        return;
    }

    let result;
    if (compoundFrequency === 'monthly') {
        // 월복리 계산
        result = calculateMonthlyCompoundInvestment(initialInvestment, monthlyInvestment, annualReturn, investmentPeriod);
    } else {
        // 연복리 계산
        result = calculateYearlyCompoundInvestment(initialInvestment, monthlyInvestment, annualReturn, investmentPeriod);
    }

    // 결과 표시
    displayInvestmentResults(result, annualReturn);
}

// 월복리 투자 계산
function calculateMonthlyCompoundInvestment(initial, monthly, annualRate, years) {
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;

    let balance = initial;
    const yearlySchedule = [];

    for (let year = 1; year <= years; year++) {
        const startBalance = balance;
        let yearlyProfit = 0;

        for (let month = 1; month <= 12; month++) {
            // 이자 발생
            const monthlyProfit = balance * monthlyRate;
            balance += monthlyProfit;
            yearlyProfit += monthlyProfit;

            // 월 투자금 추가
            balance += monthly;
        }

        const totalInvested = initial + (monthly * 12 * year);

        yearlySchedule.push({
            year: year,
            totalInvested: totalInvested,
            yearlyProfit: yearlyProfit,
            balance: balance
        });
    }

    const totalInvested = initial + (monthly * totalMonths);
    const totalProfit = balance - totalInvested;

    return {
        finalAmount: balance,
        totalInvested: totalInvested,
        totalProfit: totalProfit,
        schedule: yearlySchedule
    };
}

// 연복리 투자 계산
function calculateYearlyCompoundInvestment(initial, monthly, annualRate, years) {
    const rate = annualRate / 100;

    let balance = initial;
    const yearlySchedule = [];

    for (let year = 1; year <= years; year++) {
        const startBalance = balance;

        // 연초에 이자 발생
        const yearlyProfit = balance * rate;
        balance += yearlyProfit;

        // 월 투자금 추가 (연말에 한 번에 추가하는 것으로 단순화)
        const yearlyInvestment = monthly * 12;
        balance += yearlyInvestment;

        const totalInvested = initial + (monthly * 12 * year);

        yearlySchedule.push({
            year: year,
            totalInvested: totalInvested,
            yearlyProfit: yearlyProfit,
            balance: balance
        });
    }

    const totalInvested = initial + (monthly * 12 * years);
    const totalProfit = balance - totalInvested;

    return {
        finalAmount: balance,
        totalInvested: totalInvested,
        totalProfit: totalProfit,
        schedule: yearlySchedule
    };
}

// 투자 결과 표시 함수
function displayInvestmentResults(result, annualReturn) {
    // 결과 섹션 표시
    document.getElementById('resultSection').style.display = 'block';

    // 주요 결과 표시
    document.getElementById('finalAmount').textContent = formatCurrency(result.finalAmount);
    document.getElementById('totalInvested').textContent = formatCurrency(result.totalInvested);
    document.getElementById('totalProfit').textContent = formatCurrency(result.totalProfit);

    // 상세 정보 계산 및 표시
    const profitRate = (result.totalProfit / result.totalInvested * 100);
    const monthlyReturn = annualReturn / 12;
    const profitMultiple = result.finalAmount / result.totalInvested;

    document.getElementById('profitRate').textContent = profitRate.toFixed(2) + '%';
    document.getElementById('monthlyReturn').textContent = monthlyReturn.toFixed(2) + '%';
    document.getElementById('profitMultiple').textContent = profitMultiple.toFixed(2) + '배';

    // 투자 스케줄 표시
    displayInvestmentSchedule(result.schedule);

    // 결과로 스크롤
    document.getElementById('resultSection').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

// 투자 스케줄 테이블 표시
function displayInvestmentSchedule(schedule) {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    schedule.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.year}년차</td>
            <td>${formatCurrency(row.totalInvested)}</td>
            <td>${formatCurrency(row.yearlyProfit)}</td>
            <td>${formatCurrency(row.balance)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 입력 방식 토글 (퇴직금 계산기)
function toggleInputMethod() {
    const method = document.getElementById('inputMethod').value;
    const periodInputs = document.getElementById('periodInputs');
    const dateInputs = document.getElementById('dateInputs');

    if (method === 'period') {
        periodInputs.style.display = 'block';
        dateInputs.style.display = 'none';
    } else {
        periodInputs.style.display = 'none';
        dateInputs.style.display = 'block';
    }
}

// 상여금 입력 토글
function toggleBonusInput() {
    const includeBonus = document.getElementById('includeBonus').value;
    const bonusInput = document.getElementById('bonusInput');

    if (includeBonus === 'yes') {
        bonusInput.style.display = 'block';
    } else {
        bonusInput.style.display = 'none';
    }
}

// 퇴직금 계산 메인 함수
function calculateRetirement() {
    const inputMethod = document.getElementById('inputMethod').value;
    let totalDays;

    // 근속 일수 계산
    if (inputMethod === 'period') {
        const years = parseInt(document.getElementById('yearsWorked').value) || 0;
        const months = parseInt(document.getElementById('monthsWorked').value) || 0;

        if (years === 0 && months === 0) {
            alert('근속 기간을 입력해주세요.');
            return;
        }

        totalDays = (years * 365) + (months * 30);
    } else {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!startDate || !endDate) {
            alert('입사일과 퇴사일을 모두 입력해주세요.');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            alert('퇴사일은 입사일보다 나중이어야 합니다.');
            return;
        }

        totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    }

    // 1년 미만 체크
    if (totalDays < 365) {
        alert('퇴직금은 근속 1년 이상부터 지급됩니다.');
        return;
    }

    // 평균 급여 가져오기
    const monthlyPay = parseFloat(document.getElementById('averageMonthlyPay').value);
    if (isNaN(monthlyPay) || monthlyPay <= 0) {
        alert('올바른 월 평균 급여를 입력해주세요.');
        return;
    }

    // 상여금 가져오기
    const includeBonus = document.getElementById('includeBonus').value;
    let bonusAmount = 0;
    if (includeBonus === 'yes') {
        bonusAmount = parseFloat(document.getElementById('bonusAmount').value) || 0;
    }

    // 1일 평균임금 계산
    // (최근 3개월 급여 + 상여금) / 3개월(약 90일)
    const totalThreeMonthPay = (monthlyPay * 3) + bonusAmount;
    const dailyPay = totalThreeMonthPay / 90;

    // 30일분 평균 임금
    const thirtyDaysPay = dailyPay * 30;

    // 퇴직금 계산 = 30일분 평균임금 × (재직일수 / 365)
    const retirementPay = thirtyDaysPay * (totalDays / 365);

    // 퇴직소득세 간단 계산 (실제는 더 복잡함)
    const years = totalDays / 365;
    let taxRate;
    if (years < 5) {
        taxRate = 0.04; // 약 4%
    } else if (years < 10) {
        taxRate = 0.06; // 약 6%
    } else if (years < 20) {
        taxRate = 0.08; // 약 8%
    } else {
        taxRate = 0.10; // 약 10%
    }

    const estimatedTax = retirementPay * taxRate;
    const afterTaxRetirement = retirementPay - estimatedTax;

    // 결과 표시
    displayRetirementResults({
        totalDays,
        dailyPay,
        thirtyDaysPay,
        retirementPay,
        estimatedTax,
        afterTaxRetirement
    });
}

// 퇴직금 결과 표시
function displayRetirementResults(result) {
    // 결과 섹션 표시
    document.getElementById('resultSection').style.display = 'block';

    // 주요 결과 표시
    document.getElementById('totalRetirement').textContent = formatCurrency(result.retirementPay);
    document.getElementById('afterTaxRetirement').textContent = formatCurrency(result.afterTaxRetirement);
    document.getElementById('retirementTax').textContent = formatCurrency(result.estimatedTax);

    // 상세 정보 표시
    const years = Math.floor(result.totalDays / 365);
    const months = Math.floor((result.totalDays % 365) / 30);
    const days = Math.floor((result.totalDays % 365) % 30);

    document.getElementById('totalPeriod').textContent = `${years}년 ${months}개월 ${days}일`;
    document.getElementById('totalDays').textContent = formatNumber(result.totalDays) + '일';
    document.getElementById('dailyPay').textContent = formatCurrency(result.dailyPay);
    document.getElementById('thirtyDaysPay').textContent = formatCurrency(result.thirtyDaysPay);

    // 결과로 스크롤
    document.getElementById('resultSection').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', function() {
    // 상여금 선택 시 입력창 표시
    const includeBonusSelect = document.getElementById('includeBonus');
    if (includeBonusSelect) {
        includeBonusSelect.addEventListener('change', toggleBonusInput);
    }

    // 오늘 날짜로 퇴사일 기본값 설정
    const endDateInput = document.getElementById('endDate');
    if (endDateInput) {
        const today = new Date().toISOString().split('T')[0];
        endDateInput.value = today;
    }

    // 환율 계산기 초기화
    if (document.getElementById('fromCurrency')) {
        // 실시간 환율 가져오기
        fetchRealTimeRates().then(() => {
            updateExchangeRate();
            calculateExchange('from');
            updateRatesTable();
        });
    }

    // Enter 키로 계산 실행
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // 현재 페이지에 따라 적절한 계산 함수 호출
                if (typeof calculateLoan !== 'undefined' && document.getElementById('loanAmount')) {
                    calculateLoan();
                } else if (typeof calculateSavings !== 'undefined' && document.getElementById('monthlyDeposit')) {
                    calculateSavings();
                } else if (typeof calculateInvestment !== 'undefined' && document.getElementById('initialInvestment')) {
                    calculateInvestment();
                } else if (typeof calculateRetirement !== 'undefined' && document.getElementById('averageMonthlyPay')) {
                    calculateRetirement();
                }
            }
        });
    });
});

// 환율 계산기 함수들
// 기준 환율 (KRW 기준) - 기본값 (API 실패 시 사용)
let exchangeRates = {
    USD: 1300,
    JPY: 9,      // 100엔 = 900원이므로 1엔 = 9원
    EUR: 1450,
    CNY: 180,
    GBP: 1700,
    HKD: 165,
    AUD: 880,
    CAD: 970,
    KRW: 1
};

let currentRate = null;
let isCustomRate = false;
let lastFetchTime = null;

// 실시간 환율 가져오기
async function fetchRealTimeRates() {
    try {
        // 캐시 확인 (30분)
        const cachedData = localStorage.getItem('exchangeRates');
        const cachedTime = localStorage.getItem('exchangeRatesTime');

        if (cachedData && cachedTime) {
            const timeDiff = Date.now() - parseInt(cachedTime);
            const thirtyMinutes = 30 * 60 * 1000;

            if (timeDiff < thirtyMinutes) {
                // 캐시 사용
                exchangeRates = JSON.parse(cachedData);
                lastFetchTime = new Date(parseInt(cachedTime));
                updateLastUpdateTime();
                return true;
            }
        }

        // API 호출
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/KRW');
        if (!response.ok) throw new Error('API 호출 실패');

        const data = await response.json();

        // 환율 데이터 변환 (KRW -> 다른 통화)
        exchangeRates = {
            USD: 1 / data.rates.USD,
            JPY: 1 / data.rates.JPY,
            EUR: 1 / data.rates.EUR,
            CNY: 1 / data.rates.CNY,
            GBP: 1 / data.rates.GBP,
            HKD: 1 / data.rates.HKD,
            AUD: 1 / data.rates.AUD,
            CAD: 1 / data.rates.CAD,
            KRW: 1
        };

        // 캐시 저장
        localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
        localStorage.setItem('exchangeRatesTime', Date.now().toString());
        lastFetchTime = new Date();

        updateLastUpdateTime();
        return true;
    } catch (error) {
        console.error('환율 API 오류:', error);
        // 기본값 사용
        return false;
    }
}

// 마지막 업데이트 시간 표시
function updateLastUpdateTime() {
    const updateTimeElement = document.getElementById('lastUpdateTime');
    if (updateTimeElement && lastFetchTime) {
        const timeStr = lastFetchTime.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        updateTimeElement.textContent = `마지막 업데이트: ${timeStr}`;
    }
}

// 환율 테이블 업데이트
function updateRatesTable() {
    const currencies = ['USD', 'JPY', 'EUR', 'CNY', 'GBP', 'HKD', 'AUD', 'CAD'];

    currencies.forEach(currency => {
        const element = document.getElementById(`rate-${currency}`);
        if (element && exchangeRates[currency]) {
            let rate = exchangeRates[currency];
            // 엔화는 100엔 단위로 표시
            if (currency === 'JPY') {
                rate = rate * 100;
            }
            element.textContent = formatNumber(rate) + '원';
        }
    });
}

// 환율 업데이트
function updateExchangeRate() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (fromCurrency === toCurrency) {
        currentRate = 1;
    } else if (!isCustomRate) {
        // KRW를 기준으로 환율 계산
        if (fromCurrency === 'KRW') {
            currentRate = exchangeRates[toCurrency];
        } else if (toCurrency === 'KRW') {
            currentRate = 1 / exchangeRates[fromCurrency];
        } else {
            // 두 외화 간 환율
            currentRate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
        }
    }

    // 환율 표시 업데이트
    updateRateDisplay();
}

// 환율 표시 업데이트
function updateRateDisplay() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    document.getElementById('baseCurrency').textContent = fromCurrency;
    document.getElementById('quoteCurrency').textContent = toCurrency;

    let displayRate;
    if (fromCurrency === 'JPY' || toCurrency === 'JPY') {
        // 엔화는 100엔 단위로 표시
        if (fromCurrency === 'JPY') {
            displayRate = (currentRate * 100).toFixed(2);
            document.getElementById('rateDisplay').textContent = `100 ${fromCurrency} = ${formatNumber(displayRate)} ${toCurrency}`;
        } else {
            displayRate = (currentRate / 100).toFixed(6);
            document.getElementById('rateDisplay').textContent = `1 ${fromCurrency} = ${displayRate} ${toCurrency} (100 ${toCurrency} = ${formatNumber(currentRate * 100)} ${fromCurrency})`;
        }
    } else {
        displayRate = currentRate.toFixed(4);
        document.getElementById('rateDisplay').textContent = `1 ${fromCurrency} = ${displayRate} ${toCurrency}`;
    }
}

// 환전 계산
function calculateExchange(direction) {
    const fromAmount = parseFloat(document.getElementById('fromAmount').value) || 0;
    const toAmount = parseFloat(document.getElementById('toAmount').value) || 0;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (direction === 'from') {
        // 보내는 금액 기준으로 계산
        const result = fromAmount / currentRate;
        document.getElementById('toAmount').value = result.toFixed(2);
    } else {
        // 받는 금액 기준으로 계산
        const result = toAmount * currentRate;
        document.getElementById('fromAmount').value = result.toFixed(2);
    }

    // 요약 정보 업데이트
    updateExchangeSummary();
}

// 환전 요약 업데이트
function updateExchangeSummary() {
    const fromAmount = parseFloat(document.getElementById('fromAmount').value) || 0;
    const toAmount = parseFloat(document.getElementById('toAmount').value) || 0;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    document.getElementById('summaryFromAmount').textContent = `${formatNumber(fromAmount)} ${fromCurrency}`;

    let rateText;
    if (fromCurrency === 'JPY') {
        rateText = `100 ${fromCurrency} = ${formatNumber(currentRate * 100)} ${toCurrency}`;
    } else if (toCurrency === 'JPY') {
        rateText = `1 ${fromCurrency} = ${(currentRate / 100).toFixed(6)} ${toCurrency}`;
    } else {
        rateText = `1 ${fromCurrency} = ${currentRate.toFixed(4)} ${toCurrency}`;
    }
    document.getElementById('summaryRate').textContent = rateText;

    document.getElementById('summaryToAmount').textContent = `${formatNumber(toAmount)} ${toCurrency}`;
}

// 통화 교환
function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const fromAmount = document.getElementById('fromAmount').value;
    const toAmount = document.getElementById('toAmount').value;

    // 통화 교환
    document.getElementById('fromCurrency').value = toCurrency;
    document.getElementById('toCurrency').value = fromCurrency;

    // 금액 교환
    document.getElementById('fromAmount').value = toAmount;
    document.getElementById('toAmount').value = fromAmount;

    // 환율 및 계산 업데이트
    isCustomRate = false;
    document.getElementById('customRateInput').style.display = 'none';
    updateExchangeRate();
    updateExchangeSummary();
}

// 커스텀 환율 토글
function toggleCustomRate() {
    const customRateInput = document.getElementById('customRateInput');
    if (customRateInput.style.display === 'none') {
        customRateInput.style.display = 'block';
        document.getElementById('customRate').value = currentRate.toFixed(4);
    } else {
        customRateInput.style.display = 'none';
        isCustomRate = false;
        updateExchangeRate();
        calculateExchange('from');
    }
}

// 커스텀 환율 적용
function applyCustomRate() {
    const customRate = parseFloat(document.getElementById('customRate').value);
    if (!isNaN(customRate) && customRate > 0) {
        currentRate = customRate;
        isCustomRate = true;
        updateRateDisplay();
        calculateExchange('from');
    }
}
