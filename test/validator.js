import test from 'ava';
import Validator from './../src/validator';
import mocks from './helpers';

const validator = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|in:1,2,3,5'
});

test('it can be initialized with static create method', t => {
    const validator2 = Validator.create();
    t.true(validator2 instanceof Validator);
});

test('it can be initialized without validations', t => {
    const validator2 = new Validator();
    t.true(validator2 instanceof Validator);
});

test('it validates all values', t => {
    const result = validator.validateAll({
        email: 'foo@bar.com',
        name: 'John Snow',
        title: 'Winter is coming',
        content: 'John knows nothing',
        tags: 1
    });

    t.true(result);
    t.deepEqual(validator.errorBag.all(), []);
});

test('it formats error messages', t => {
    const result = validator.validateAll({
        email: 'foo@bar.c',
        name: '',
        title: 'Wi',
        content: 'John knows nothing about this validator',
        tags: 4
    });

    t.false(result);
    t.deepEqual(validator.errorBag.all(), [
        'The email must be a valid email.',
        'The name is required.',
        'The name must be at least 3 characters.',
        'The title must be at least 3 characters.',
        'The content may not be greater than 20 characters.',
        'The tags must be a valid value.'
    ]);
    t.deepEqual(validator.getErrors().all(), [
        'The email must be a valid email.',
        'The name is required.',
        'The name must be at least 3 characters.',
        'The title must be at least 3 characters.',
        'The content may not be greater than 20 characters.',
        'The tags must be a valid value.'
    ]);

});
test('it can attach new rules', t => {
    validator.attach('field', 'required|min:5');
    t.false(validator.validate('field', 'less'));
    t.true(validator.validate('field', 'not less'));
});

test('it can attach new rules and display errors with custom names', t => {
    validator.attach('field', 'min:5', 'pretty field');
    validator.validate('field', 'wo');
    t.is(validator.getErrors().first('field'), 'The pretty field must be at least 5 characters.')
});

test('attaching new rules to an existing field should overwrite the old rules', t => {
    validator.attach('someField', 'required|min:3');
    t.false(validator.validate('someField', 'wo')); // add error.
    t.is(validator.errorBag.collect('someField').length, 1);

    // does it overwrite the old rule?
    validator.attach('someField', 'min:1|max:3');
    t.is(validator.errorBag.collect('someField').length, 0); // are field errors rest?
    t.true(validator.validate('someField', 'wo')); // was the old min validator overwritten?
    t.false(validator.validate('someField', 'woww')); // did the max validator work?
});

test('it returns false when trying to validate a non-existant field.', t => {
    t.false(validator.validate('nonExistant', 'whatever'));
});

test('it can detach rules', t => {
    validator.detach('field');
    t.falsy(validator.$fields.field);
});

test('it can extend the validator with a validator function', t => {
    validator.extend('neg', (value) => Number(value) < 0);
    validator.attach('anotherField', 'neg');
    t.true(validator.validate('anotherField', -1));
    t.false(validator.validate('anotherField', 1));
    // default message check.
    t.is(validator.errorBag.first('anotherField'), 'The anotherField value is not valid.');
});

test('it can extend the validators for a validator instance', t => {
    const truthy = {
        getMessage: (field) => `The ${field} value is not truthy.`,
        validate: (value) => !! value
    };

    Validator.extend('truthy', truthy); // static extend.
    validator.attach('anotherField', 'truthy');
    t.true(validator.validate('anotherField', 1));
    t.false(validator.validate('anotherField', 0));
    t.is(validator.errorBag.first('anotherField'), 'The anotherField value is not truthy.');
});

test('it can add a custom validator with localized messages', t => {
    const falsy = {
        messages: {
            en: (field) => `The ${field} value is not falsy.`,
            ar: () => 'Some Arabic Text'
        },
        validate: (value) => ! value
    };
    Validator.extend('falsy', falsy);
    validator.attach('anotherField', 'falsy');
    t.false(validator.validate('anotherField', 1));
    t.is(validator.errorBag.first('anotherField'), 'The anotherField value is not falsy.');
    validator.setLocale('ar');
    t.false(validator.validate('anotherField', 1));
    t.is(validator.errorBag.first('anotherField'), 'Some Arabic Text');
});

test('it can set the default locale for newly created validators', t => {
    Validator.updateDictionary({ ar: { alpha: () => 'البتاعة لازم يكون حروف بس' } });
    Validator.setDefaultLocale('ar');
    const loc = new Validator({ name: 'alpha' });
    t.false(loc.validate('name', '1234'));
    t.is(loc.locale, 'ar');
    t.is(loc.getErrors().first('name'), 'البتاعة لازم يكون حروف بس');
    Validator.setDefaultLocale(); // resets to english.
    Validator.updateDictionary({ ar: { alpha: '' } }); // reset the dictionary for other tests.
});

test('it can override the default strict mode for newly created validators', t => {
    Validator.setStrictMode(false);
    const loc = new Validator({ name: 'alpha' });
    t.true(loc.validate('location', '1234'));
});

test('it throws an exception when extending with an invalid validator', t => {
    // Static Extend.
    // No getMessage nor a validate method.
    t.throws(() => {
        Validator.extend('fail', {});
    });
    // No validate method.
    t.throws(() => {
        Validator.extend('fail', { getMessage: name => name });
    });
    // No getMessage method.
    t.throws(() => {
        Validator.extend('fail', { validate: () => true });
    });
    // numeric is already registered.
    t.throws(() => {
        Validator.extend('numeric', { getMessage: name => name, validate: () => true });
    });
});


test('it defaults to english messages if no current locale counterpart is found', t => {
    const loc = new Validator({ first_name: 'alpha' });
    loc.setLocale('ar');
    loc.attach('first_name', 'alpha');
    loc.validate('first_name', '0123');
    t.is(
        loc.errorBag.first('first_name'),
        'The first_name may only contain alphabetic characters.'
    );
});

test('it can overwrite messages and add translated messages', t => {
    const loc = new Validator({ first_name: 'alpha' });
    Validator.updateDictionary({
        ar: { alpha: (field) => `${field} يجب ان يحتوي على حروف فقط.` },
        en: { alpha: (field) => `${field} is alphabetic.` }
    });
    loc.attach('first_name', 'alpha');
    loc.validate('first_name', '0123');
    t.is(loc.errorBag.first('first_name'), 'first_name is alphabetic.');
    loc.setLocale('ar');
    loc.validate('first_name', '0123');
    t.is(loc.errorBag.first('first_name'), 'first_name يجب ان يحتوي على حروف فقط.');
    loc.updateDictionary({
        ar: { alpha: () => 'My name is jeff' }
    });
    loc.validate('first_name', '0123');
    t.is(loc.errorBag.first('first_name'), 'My name is jeff');
});

test('test merging line 30', t => {
    const chineseValidator = new Validator({ first_name: 'alpha' });
    chineseValidator.updateDictionary({
        cn: { alpha: () => 'My name is jeff' }
    });
    chineseValidator.setLocale('cn');

    chineseValidator.validate('first_name', '0123');
    t.is(chineseValidator.errorBag.first('first_name'), 'My name is jeff');
});

test('it should resolve promises to booleans', async t => {
    const params = [150, 100];
    const v = new Validator({
        image: 'dimensions:150,100'
    });

    mocks.dimensionsTest({ width: 150, height: 100 });

    let value = await v.validate('image', [mocks.file('file.jpg', 'image/jpeg', 10)], params);
    t.true(value);

    mocks.dimensionsTest({ width: 150, height: 100}, true);
    value = await v.validate('image', [mocks.file('file.jpg', 'image/jpeg', 10)], params);
    t.false(value);

    value = await v.validate('image', [mocks.file('file.pdf', 'application/pdf', 10)], params);
    t.false(value);

    mocks.dimensionsTest({ width: 30, height: 20});
    value = await v.validate('image', [mocks.file('file.jpg', 'image/jpeg', 10)], params);
    t.false(value);
});
