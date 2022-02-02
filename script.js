'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
// console.log(arr);
// console.log(arr.slice(2));
// console.log(arr.slice(1, 4)); //begin, end // but the end index is NOT included except for negative no.s
// console.log(arr.slice(1, -2));
// console.log(arr.slice()); //shallow copy of an array
// console.log([...arr]);

//SPLICE
console.log(arr.splice(1, 2)); //begin, no. of elements to delete
console.log(arr);
console.log(arr.splice(0, 2));
console.log(arr);

//BANKIST APP
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (acc, sort = false) {
  //resets the hard coded elements values to blank
  containerMovements.innerHTML = '';
  //loop through the movement array without creating a new array
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    //declared the decision to be used in multiple places ---DRY--- Principle
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    //used template literals for multiline purposes
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${Math.abs(mov.toFixed(2))}€</div>
  </div>
    `;
    //to insert the html template into the document. parameters are(position, text to be inserted)
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const calcDisplaySummary = function (acc) {
  //Money deposited
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  //outputing the value in the document
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  //Money withdrawn
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes.toFixed(2))}€`;

  const interestAcc = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interestAcc.toFixed(2)}€`;
};
// calcDisplaySummary(account1.movements);
////////////////////////////////

// REDUCE METHOD

const calcDisplayBalance = function (acc) {
  //Declaring a new property balance and storing it
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

////////////////////
const createUserName = function (accs) {
  accs.forEach(acc => {
    //Creating new property username
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) //picks the 1st letter of every word
      .join(''); /* joins the selected letters hjha */
    // return acc.username;
  });
};
createUserName(accounts);

const updateUI = function (acc) {
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
  displayMovements(acc);
};

//////////////////////////////////////////////////////////////////
let currentAccount;
// Adding event listener for btnLogin
btnLogin.addEventListener('click', function (e) {
  //prevents automatic submission i.e reloading the page
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  //optional chaining (?) tests whether an ele exists
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //Manipulating the style ele
    containerApp.style.opacity = 100;
    //Clearing the input Fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
  // else {
  //   console.log('no match of account by the same name 🙇‍♀️🙇‍♀️');
  // }
});

/////////////////////////////////////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  //Checking the receiver Acc.
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, recieverAcc);

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAccount);

    // console.log('Valid transfer');
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    // console.log('Right credentials');
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.forEach(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   return humanAges;
// };
// console.log(calcAverageHumanAge([2, 4, 5, 6, 3]));

// console.log(containerMovements.innerHTML);

//Other codes
const dogJulia = [2, 4, 5, 6, 3];
const dogKate = [1, 2, 3, 4, 5];

const checkDogs = (dogJulia, dogKate) => {
  // const dogJuliaCopy = [...dogJulia];
  const dogJuliaCopy = dogJulia.slice();
  dogJuliaCopy.splice(0, 1);
  dogJuliaCopy.splice(-2);
  // dogJuliaCopy.splice();
  // console.log(dogJuliaCopy);
  // const dogs = [...dogKate, ...dogJuliaCopy];
  const dogs = dogKate.concat(dogJuliaCopy);
  // console.log(dogs);

  //dog number 1 is a puppy, and is 2 years old
  for (const [i, age] of dogs.entries()) {
    //   age < 3
    //     ? console.log(
    //         `Dog number ${i + 1} is a puppy, and it is ${age} years old`
    //       )
    //     : console.log(
    //         `Dog number ${i + 1} is an adult, and it is ${age} years old`
    //       );
    // console.log(
    //   `Dog number ${i + 1} is ${
    //     age < 3 ? 'still a puppy 🐶🐶' : 'an adult'
    //   }, and it is ${age} years old`
    // );
  }
  // console.log('----forEach--------');
  dogs.forEach(function (dog, i, arr) {
    // dog < 3
    //   ? console.log(
    //       `Dog number ${i + 1} is a puppy, and it is ${dog} years old`
    //     )
    //   : console.log(
    //       `Dog number ${i + 1} is an adult, and it is ${dog} years old`
    //     );
    // console.log(
    //   `Dog number ${i + 1} is ${
    //     dog < 3 ? 'a puppy' : 'an adult'
    //   }, and it is ${dog} years old`
    // );
  });
};
checkDogs(dogJulia, dogKate);

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age =>
    age <= 2 ? ` ${age * 2}` : ` ${16 + age * 4}`
  );
  // return humanAges;
  // console.log(humanAges);
  const adultDogs = humanAges.filter(a => a >= 18);
  // console.log(adultDogs);

  const avgDog = adultDogs.reduce(
    (acc, cur, i, arr) => acc + cur / arr.length,
    0
  );
  return avgDog;
  // const humanAges = age <= 2 ? age * 2 : 16 + age * 4
};
const cal1 = calcAverageHumanAge(dogKate);
const cal2 = calcAverageHumanAge(dogJulia);
// console.log(cal1, cal2);

const calcAverageHumanAge1 = ages =>
  ages
    .map(age => (age <= 2 ? `${age * 2}` : `${16 + age * 4}`))
    .filter(age => age >= 18)
    .reduce((acc, mov, i, arr) => acc + mov / arr.length, 0);

// console.log('-----space-----');
const al = calcAverageHumanAge1([1, 2, 3, 4, 5, 6, 7]);
const cal11 = calcAverageHumanAge(dogKate);
const cal12 = calcAverageHumanAge(dogJulia);
// console.log(cal11, cal12);
// console.log(al);

const reduceArray = [1, 2, 3, 4, 5, 6, 7];
const newReduceArray =
  reduceArray.reduce((acc, cur) => acc + cur, 0) / reduceArray.length;
// console.log(newReduceArray);

////////////////

//CHAINING METHODS
const euroToUsd = 1.1;
const totalBalanceUsd = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * euroToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalBalanceUsd);

// dogs.forEach(function())

// const arr1 = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['f', 'g', 'h', 'i', 'j'];
// console.log(arr1);
// console.log(arr1.slice(2, 8));
// console.log(arr1.slice(-5));
// console.log(arr1.slice(2, -2));

// console.log('----Need a separator------');
// // console.log(arr1.splice(-5));
// // console.log(arr1);

// const letters = arr1.concat(arr2);

// console.log(letters);
// console.log(letters.join(' * '));
// console.log(letters);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const check = movements.forEach((mov, i, arr) => {
  // mov > 0
  //   ? console.log(`You deposited ${mov}`)
  //   : console.log(`You withdrew ${Math.abs(mov)}`);
  // console.log(
  //   `Movement ${i + 1} : You ${mov > 0 ? 'deposited' : 'withdrew'} : ${Math.abs(
  //     mov
  //   )}`
  // );
});
// console.log(check);
//Deposits
//FILTER METHOD
const deposit = movements.filter(mov => mov > 0);
console.log(deposit);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

// const balance = movements.reduce((acc, cur, i, arr) => acc + cur, 0);
// console.log(balance);

// MAX VALUE
const max = movements.reduce((acc, mov) => (acc > mov ? acc : mov));
// console.log(max);

const min = movements.reduce((acc, mov) => (acc < mov ? acc : mov));
// console.log(min);
/////////////////////////////////////////////////
//FIND METHOD - finds the 1st specific ele that meets the condition

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

// console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

//assignment achieve the same results as one above using the for of loop.
// for (account of accounts) {
//   if (account.owner === 'Jessica Davis') {
//     console.log(`${account}`);
//   } else {
//     console.log('no match of account by the same name 🙇‍♀️🙇‍♀️');
//   }
// }

/// Flat and flatMap Methods

const arrFlat = [[1, 2, [3, [4]]], 5, 6, [7, 8, 9]];
console.log(arrFlat.flat(3));

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);

const allMovements = accountMovements.flat();
const allBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(allBalance);

const nestedChain2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(nestedChain2);

// flatMap
const nestedChain = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(nestedChain);

console.log(movements);
// SORTING
//ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

movements.sort((a, b) => a - b);
console.log(movements);

//descending

// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });

movements.sort((a, b) => b - a);
console.log(movements);

const y = Array.from({ length: 7 }, (_, i) => i + 1);

// a 100 dice rolls using Array.from()

console.log(Math.trunc(Math.random() * 6) + 1);
const dice = Array.from({ length: 10 }, (_, i) => {
  i = Math.trunc(Math.random() * 6) + 1;
});
console.log(dice);

labelBalance.addEventListener('click', function () {
  // e.preventDefault();

  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});

///////////////////////////////////////
//More practise on the array Methods

const bankDepositSumEx = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSumEx);

//2.
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(numDeposits1000);

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 1000)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(numDeposits1000);

const depositsShort = accounts
  .flatMap(acc => acc.movements)
  // .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(depositsShort);

//prefixed increment operator
let a = 10;
console.log(a++); //returns the old value though it has been increased
console.log(a);

//advanced reduce methods

// const sumss = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(sumss);

//distructuring
const { deposits, withdrawal } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawal += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawal'] += cur; //simplified using the bracket notation
      return sums;
    },
    { deposits: 0, withdrawal: 0 }
  );
console.log(deposits, withdrawal);

//converting into Title case
const convertTitleCase = function (title) {
  const capitzalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'the', 'but', 'and', 'with', 'or', 'in', 'on'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitzalize(word)))
    .join(' ');
  return capitzalize(titleCase);
};
// const stre = 'here and i can write a perfect  title for an example';
console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title'));
// console.log(convertTitleCase('this is a  very LONG and excellent title'));
// console.log(convertTitleCase(stre));

////////////////////////////////////////////////////////////////////////////////////////////////////
/* --------------------------CHALLENGE --------------------------------*/

const dogsObject = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// console.log(dogsObject);
// const calcRecommend = function (dogRec) {
//   dogRec.recommendedFood = dogRec.forEach(weight => weight ** 0.75 * 28);
//   // console.log(dogRec.recommendedFood)
// };
// console.log(calcRecommend(dogsObject));

const weightDogs = dogsObject.forEach(weight => weight * 2);
// console.log(weightDogs);

//SOLUTION
//1.
dogsObject.forEach(
  dogs => (dogs.recommendedFood = Math.trunc(dogs.weight ** 0.75 * 28))
);
console.log(dogsObject);

//2.
const dogSarah = dogsObject.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);

console.log(
  `Sarah's dog is eating ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  } food`
);
//3.
const ownerEatmuch = dogsObject
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownerEatmuch);

const ownerEatLittle = dogsObject
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownerEatLittle);
//4.

console.log(`${ownerEatmuch.join(' and ')}'s dog eat too much`);
console.log(`${ownerEatLittle.join(' and ')}'s dog eat little food`);

//5.
console.log(dogsObject.some(dog => dog.curFood === dog.recommendedFood));

//6.
const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

const everyDog = dogsObject.some(checkEatingOkay);
console.log(everyDog);

//7.
const everyowner = dogsObject
  .filter(checkEatingOkay)
  .flatMap(dog => dog.owners);
console.log(everyowner);

//8.
const dogsCopy = dogsObject
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsCopy);
