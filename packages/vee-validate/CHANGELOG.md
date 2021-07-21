# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.5.0-alpha.3](https://github.com/logaretm/vee-validate/compare/v4.4.7...v4.5.0-alpha.3) (2021-07-21)


### Bug Fixes

* correctly stage the priority of the initial values ([ab0eaf5](https://github.com/logaretm/vee-validate/commit/ab0eaf540c5c1d2726b07419f0701feff8877350))
* prevent initial values from overwritting existing values ([314c8f4](https://github.com/logaretm/vee-validate/commit/314c8f4a3e0d456447336453711ec823696bbb4f))


### Features

* **perf:** re-write field tracking and batch schema validation closes [#3399](https://github.com/logaretm/vee-validate/issues/3399) ([1c41cec](https://github.com/logaretm/vee-validate/commit/1c41cecbc88f3a154d37a5518620a060062a614a))
* expose setters in composition API ([a4e6c47](https://github.com/logaretm/vee-validate/commit/a4e6c47bc19241e30f559fcc0fd228647afe72d2))





# [4.5.0-alpha.2](https://github.com/logaretm/vee-validate/compare/v4.5.0-alpha.1...v4.5.0-alpha.2) (2021-07-08)

### Bug Fixes

- clean error message for singular fields after unmount ([#3385](https://github.com/logaretm/vee-validate/issues/3385)) ([79c82eb](https://github.com/logaretm/vee-validate/commit/79c82eb9009662576f8f23b8491626c20176d92f))

# [4.5.0-alpha.1](https://github.com/logaretm/vee-validate/compare/v4.4.5...v4.5.0-alpha.1) (2021-07-06)

### Bug Fixes

- quit unsetting path if its already unset ([64ba5f9](https://github.com/logaretm/vee-validate/commit/64ba5f9ad23603fbcbfdf4ce17866dc657c6846d))

# [4.5.0-alpha.0](https://github.com/logaretm/vee-validate/compare/v4.4.3...v4.5.0-alpha.0) (2021-06-03)

### Bug Fixes

- correctly assign the initial value if it was null closes [#3352](https://github.com/logaretm/vee-validate/issues/3352) ([1e9cfd1](https://github.com/logaretm/vee-validate/commit/1e9cfd16591fab9cedf39dc9210151ab5b4be4c6))

## [4.4.7](https://github.com/logaretm/vee-validate/compare/v4.4.6...v4.4.7) (2021-07-20)

### Bug Fixes

- avoid watching values at the end of reset calls closes [#3407](https://github.com/logaretm/vee-validate/issues/3407) ([86f594f](https://github.com/logaretm/vee-validate/commit/86f594f4a7cee5ed5f581419bdbd985fc53f8358))

### Features

- add standalone prop for fields ([#3379](https://github.com/logaretm/vee-validate/issues/3379)) ([3689437](https://github.com/logaretm/vee-validate/commit/36894378aa3636eeb4fb54aa747319e21c6eb5cd))
- expose FieldContext type closes [#3398](https://github.com/logaretm/vee-validate/issues/3398) ([a6e4c0a](https://github.com/logaretm/vee-validate/commit/a6e4c0ac580d4145c72118ac535bfa082c771068))
- expose form and field injection keys ([6034e66](https://github.com/logaretm/vee-validate/commit/6034e66836e0566e17f36744da19088aca33fbad))

## [4.4.6](https://github.com/logaretm/vee-validate/compare/v4.4.5...v4.4.6) (2021-07-08)

### Bug Fixes

- clean error message for singular fields after unmount ([#3385](https://github.com/logaretm/vee-validate/issues/3385)) ([4e81cce](https://github.com/logaretm/vee-validate/commit/4e81cce292380974728b952a2fa1724c1ea4f086))
- quit unsetting path if its already unset ([cfe45ba](https://github.com/logaretm/vee-validate/commit/cfe45ba38690ec27b5ee4e48a80336834a932a78))
- expose setters in composition API ([d79747d](https://github.com/logaretm/vee-validate/commit/d79747de4a25d1ced151d9bd5b767e815d7e32bf))

## [4.4.5](https://github.com/logaretm/vee-validate/compare/v4.4.4...v4.4.5) (2021-06-13)

## [4.4.4](https://github.com/logaretm/vee-validate/compare/v4.4.3...v4.4.4) (2021-06-05)

### Bug Fixes

- field with pre-register schema errors should be validated on register closes [#3342](https://github.com/logaretm/vee-validate/issues/3342) ([61c7359](https://github.com/logaretm/vee-validate/commit/61c73597b2e69c094e75c02476d825c5236710b5))
- make sure to create the container path if it exists while null or undefined ([79d3779](https://github.com/logaretm/vee-validate/commit/79d37798ccf2fef56714bdad4db553086df0ad48))
- make sure to create the container path if it exists while null or undefined ([79d3779](https://github.com/logaretm/vee-validate/commit/79d37798ccf2fef56714bdad4db553086df0ad48))

### Features

- expose setters in composition API ([61f942f](https://github.com/logaretm/vee-validate/commit/61f942f511e6fcceb10a74272ac845017ce88997))

## [4.4.3](https://github.com/logaretm/vee-validate/compare/v4.4.2...v4.4.3) (2021-06-02)

### Bug Fixes

- respect the Field bails option closes [#3332](https://github.com/logaretm/vee-validate/issues/3332) ([6679387](https://github.com/logaretm/vee-validate/commit/66793878e317f32f4759b3d01e27e3b9072eff67))

## [4.4.2](https://github.com/logaretm/vee-validate/compare/v4.4.1...v4.4.2) (2021-05-28)

### Bug Fixes

- clean up the old values path when fields exchange names fixes [#3325](https://github.com/logaretm/vee-validate/issues/3325) ([fe51c12](https://github.com/logaretm/vee-validate/commit/fe51c126ae6258ac0888ee47d9d01a27b889a5c1))

## [4.4.1](https://github.com/logaretm/vee-validate/compare/v4.4.0...v4.4.1) (2021-05-24)

### Bug Fixes

- forgot adding errors in useValidationForm ([d032d3b](https://github.com/logaretm/vee-validate/commit/d032d3b55438169fa87c18d89e073fffe3988d56))
- re-introduce the errors prop back on the form validation result closes [#3317](https://github.com/logaretm/vee-validate/issues/3317) ([b439a73](https://github.com/logaretm/vee-validate/commit/b439a73bf3c37298c251b74223984d54b8949a95))

# [4.4.0](https://github.com/logaretm/vee-validate/compare/v4.4.0-alpha.2...v4.4.0) (2021-05-23)

### Bug Fixes

- seperate model detection from event emitting closes [#3312](https://github.com/logaretm/vee-validate/issues/3312) ([5e72852](https://github.com/logaretm/vee-validate/commit/5e72852e80b971121d10422cf84085b07bb2d8fb))

# [4.4.0-alpha.2](https://github.com/logaretm/vee-validate/compare/v4.4.0-alpha.1...v4.4.0-alpha.2) (2021-05-14)

### Bug Fixes

- avoid clearing all errors before validating schema ([51c2e78](https://github.com/logaretm/vee-validate/commit/51c2e7890b87d971850dfc609c09d19b79a96fb6))

# [4.4.0-alpha.1](https://github.com/logaretm/vee-validate/compare/v4.4.0-alpha.0...v4.4.0-alpha.1) (2021-05-14)

### Bug Fixes

- minifier issue when handling await ([f206cac](https://github.com/logaretm/vee-validate/commit/f206cacd7e0d03a36fce5b236c23906997e0287b))

# [4.4.0-alpha.0](https://github.com/logaretm/vee-validate/compare/v4.3.6...v4.4.0-alpha.0) (2021-05-14)

### Bug Fixes

- deprecate handleInput and use handleChange for both events ([#3303](https://github.com/logaretm/vee-validate/issues/3303)) ([4cb10de](https://github.com/logaretm/vee-validate/commit/4cb10de0a5f589f72c82cdd4a8859b7f044ae84c))

### Features

- custom values and errors ([#3305](https://github.com/logaretm/vee-validate/issues/3305)) ([427802b](https://github.com/logaretm/vee-validate/commit/427802b94ea309d12df26ba51ac1b3a24e4e8d46))

## [4.3.6](https://github.com/logaretm/vee-validate/compare/v4.3.5...v4.3.6) (2021-05-08)

### Bug Fixes

- added a symbol to detect non passed props with Vue 3.1.x ([#3295](https://github.com/logaretm/vee-validate/issues/3295)) ([0663539](https://github.com/logaretm/vee-validate/commit/06635397424526c3a3c4a53f63322bbfd55000ee))

## [4.3.5](https://github.com/logaretm/vee-validate/compare/v4.3.4...v4.3.5) (2021-05-01)

### Bug Fixes

- priotrize self injections over parent injections closes [#3270](https://github.com/logaretm/vee-validate/issues/3270) ([07c1234](https://github.com/logaretm/vee-validate/commit/07c12341d7f2e25e41a56ea0d5e38e9a374ae84b))

## [4.3.4](https://github.com/logaretm/vee-validate/compare/v4.3.3...v4.3.4) (2021-04-27)

### Bug Fixes

- update the valid flag regardless of mode closes [#3284](https://github.com/logaretm/vee-validate/issues/3284) ([6594ad1](https://github.com/logaretm/vee-validate/commit/6594ad15e4423c6a7861da188560b06f98365d9d))

## [4.3.3](https://github.com/logaretm/vee-validate/compare/v4.3.2...v4.3.3) (2021-04-22)

### Features

- touch all fields on submit ([#3278](https://github.com/logaretm/vee-validate/issues/3278)) ([fc4e400](https://github.com/logaretm/vee-validate/commit/fc4e400f7d9349c1e82bba8412d13e0cf69be0e1))

## [4.3.2](https://github.com/logaretm/vee-validate/compare/v4.3.1...v4.3.2) (2021-04-21)

### Bug Fixes

- unwrap initial value with useField.resetField fixes [#3272](https://github.com/logaretm/vee-validate/issues/3272) ([#3274](https://github.com/logaretm/vee-validate/issues/3274)) ([f6e9574](https://github.com/logaretm/vee-validate/commit/f6e95741f31fc085f718e07d3b1f1adfe0229df6))

## [4.3.1](https://github.com/logaretm/vee-validate/compare/v4.3.0...v4.3.1) (2021-04-18)

### Bug Fixes

- give error message component a name ([b7dcebf](https://github.com/logaretm/vee-validate/commit/b7dcebfcd202538cf082314817f97c3b8e07fefb))
- minor perf enhancement by lazy evaulation of slot props ([a306b1b](https://github.com/logaretm/vee-validate/commit/a306b1b0047ec82eaf727a6e380856de077c4fbe))

# [4.3.0](https://github.com/logaretm/vee-validate/compare/v4.2.4...v4.3.0) (2021-04-07)

### Features

- added support for reactive schemas ([#3238](https://github.com/logaretm/vee-validate/issues/3238)) ([295d656](https://github.com/logaretm/vee-validate/commit/295d6567035bc3c452ad0f13fce13ff362b08005))
- added support for setting multiple field errors closes [#3117](https://github.com/logaretm/vee-validate/issues/3117) ([db0a6a0](https://github.com/logaretm/vee-validate/commit/db0a6a02cdc0fdab02a18e4756005c46dc06b1f8))
- support v-model.number ([#3252](https://github.com/logaretm/vee-validate/issues/3252)) ([8f491da](https://github.com/logaretm/vee-validate/commit/8f491da0b0998d0f7383a6a444d6aa498e3d96f4))

## [4.2.4](https://github.com/logaretm/vee-validate/compare/v4.2.3...v4.2.4) (2021-03-26)

### Bug Fixes

- validation triggered on value change ([10549b7](https://github.com/logaretm/vee-validate/commit/10549b77dc350cee4f198cb14e3fd12f61e12b80))

## [4.2.3](https://github.com/logaretm/vee-validate/compare/v4.2.2...v4.2.3) (2021-03-22)

### Bug Fixes

- prevent yup schema from setting non-interacted fields errors closes [#3228](https://github.com/logaretm/vee-validate/issues/3228) ([534f8b2](https://github.com/logaretm/vee-validate/commit/534f8b28850c9f28245a748f956d1358bb7cb2e1))

## [4.2.2](https://github.com/logaretm/vee-validate/compare/v4.2.1...v4.2.2) (2021-03-03)

### Bug Fixes

- ensure having a truthy fallback for fields missing in schema ([7cd6941](https://github.com/logaretm/vee-validate/commit/7cd694114403f7c252b6ba6b83c159110cdc58cf))
- handle pending validation runs during field unmounting ([ef5a7cc](https://github.com/logaretm/vee-validate/commit/ef5a7ccb269db8bbdee446e76dd60ebe8704b57e))

## [4.2.1](https://github.com/logaretm/vee-validate/compare/v4.2.0...v4.2.1) (2021-02-26)

### Bug Fixes

- added initial check against the field errors ([4288fb6](https://github.com/logaretm/vee-validate/commit/4288fb6291a3ed17d46569fd2b0baa690beb9cb1))

# [4.2.0](https://github.com/logaretm/vee-validate/compare/v4.1.20...v4.2.0) (2021-02-24)

**Note:** Version bump only for package vee-validate

## [4.1.20](https://github.com/logaretm/vee-validate/compare/v4.1.19...v4.1.20) (2021-02-24)

### Bug Fixes

- avoid setting checkbox values before registeration closes [#3183](https://github.com/logaretm/vee-validate/issues/3183) ([ab5f821](https://github.com/logaretm/vee-validate/commit/ab5f82103f8cfe5f5934a51057ce989ad30d0d44))
- change errors source to form closes [#3177](https://github.com/logaretm/vee-validate/issues/3177) ([7c13c92](https://github.com/logaretm/vee-validate/commit/7c13c92f477bc3d63067509fd9fec72964263f5d))
- use the issues array for zod error aggregation closes [#3184](https://github.com/logaretm/vee-validate/issues/3184) ([01b89e4](https://github.com/logaretm/vee-validate/commit/01b89e4940e997ef65dc950be3a13e0ffc18e881))

## [4.1.19](https://github.com/logaretm/vee-validate/compare/v4.1.18...v4.1.19) (2021-02-16)

### Bug Fixes

- use relative imports for shared type ([6790545](https://github.com/logaretm/vee-validate/commit/6790545dc9c35550d231fb14a310f3655dbc7256))

### Features

- improve typing for field yup schema ([c59f1f0](https://github.com/logaretm/vee-validate/commit/c59f1f01526b160a1081f276d732523ad9ab5ba2))

## [4.1.18](https://github.com/logaretm/vee-validate/compare/v4.1.17...v4.1.18) (2021-02-10)

### Bug Fixes

- avoid unsetting field value if switched with another closes [#3166](https://github.com/logaretm/vee-validate/issues/3166) ([f5a79fe](https://github.com/logaretm/vee-validate/commit/f5a79fe3b15f7437acf183c162e69178fd4fa7ec))

## [4.1.17](https://github.com/logaretm/vee-validate/compare/v3.2.0...v4.1.17) (2021-02-08)

### Bug Fixes

- add a handler for regex object params closes [#3073](https://github.com/logaretm/vee-validate/issues/3073) ([7a5e2eb](https://github.com/logaretm/vee-validate/commit/7a5e2ebf8303395372ae08ebcca55427a58faecb))
- added emits and onSubmit custom prop ([#3115](https://github.com/logaretm/vee-validate/issues/3115)) ([8f2c110](https://github.com/logaretm/vee-validate/commit/8f2c110f14add0fbd82a28a91601e89938144624))
- array radio fields not switching value correctly closes [#3141](https://github.com/logaretm/vee-validate/issues/3141) ([3d4efef](https://github.com/logaretm/vee-validate/commit/3d4efef68c63a3b57e2bf14fed913dbf841a7f5e))
- avoid returning undefined for form errors when form does not exist ([8cce17a](https://github.com/logaretm/vee-validate/commit/8cce17ae2846be912d51926c79e557ed8bb39582))
- avoid validating dependencies via watcheffect closes [#3156](https://github.com/logaretm/vee-validate/issues/3156) ([a7b91f6](https://github.com/logaretm/vee-validate/commit/a7b91f6e6c38f0b5262e2d4c1814154efa3b78c8))
- cast radio buttons value correctly closes [#3064](https://github.com/logaretm/vee-validate/issues/3064) ([3e0f9a4](https://github.com/logaretm/vee-validate/commit/3e0f9a47369edac32d0c8a068f8b61d8f761458f))
- clear out initial values for unregistered fields closes [#3060](https://github.com/logaretm/vee-validate/issues/3060) ([56206de](https://github.com/logaretm/vee-validate/commit/56206de995fe8f2eaca3e303ab6980784a3c95b1))
- correctly set the initial value from the v-model closes [#3107](https://github.com/logaretm/vee-validate/issues/3107) ([4bed9a8](https://github.com/logaretm/vee-validate/commit/4bed9a806323139d2f274e51b6bfe3de2190e54d))
- export submission types [#3112](https://github.com/logaretm/vee-validate/issues/3112) ([3f35167](https://github.com/logaretm/vee-validate/commit/3f351670da02364b0fb8e61198145dfa02dc59b9))
- fill the target rule params for message generators closes [#3077](https://github.com/logaretm/vee-validate/issues/3077) ([f5e1bd3](https://github.com/logaretm/vee-validate/commit/f5e1bd3cbc278a8588fa0c96af66823d82eefb8c))
- handle formless checkboxes value toggling closes [#3105](https://github.com/logaretm/vee-validate/issues/3105) ([504f30b](https://github.com/logaretm/vee-validate/commit/504f30bfcbcb1db710397ef05545b5008b0103fb))
- handle reactive field names and value swaps ([cf8051d](https://github.com/logaretm/vee-validate/commit/cf8051d3b92eb43103f4e7c682e615343239d717))
- missing export for useErrors helpers ([28537cc](https://github.com/logaretm/vee-validate/commit/28537cc547cf945b10adc485620ad226f71d60fc))
- pass down listeners to the input node closes [#3048](https://github.com/logaretm/vee-validate/issues/3048) ([2526a63](https://github.com/logaretm/vee-validate/commit/2526a63c2361e412b528cf370c03b39cb84b606d))
- prevent default reset behavior with handleReset ([a66df13](https://github.com/logaretm/vee-validate/commit/a66df13c3f39d84984581dc3c0ce368b052b6e8e))
- prevent resetForm from toggling checkbox value [#3084](https://github.com/logaretm/vee-validate/issues/3084) ([38778f9](https://github.com/logaretm/vee-validate/commit/38778f96471b6aa16fb020cfb1bde56b77a19cfb))
- react to validation events changes ([078e61b](https://github.com/logaretm/vee-validate/commit/078e61b17bd299a28752b733b494a0ddb368a812))
- reset meta correctly with resetField ([012658c](https://github.com/logaretm/vee-validate/commit/012658c082a00b1beeb53ce8cf3fcd91bc5b21ec))
- resolve component before rendering closes [#3014](https://github.com/logaretm/vee-validate/issues/3014) ([f8f481d](https://github.com/logaretm/vee-validate/commit/f8f481daad754a4b18a91e2b07b9549433d023f9))
- resolve path values with global rules closes [#3157](https://github.com/logaretm/vee-validate/issues/3157) ([beaf316](https://github.com/logaretm/vee-validate/commit/beaf3168490aee585542a19c9a910d9493e78208))
- set field initial value on the fid lookup closes [#3128](https://github.com/logaretm/vee-validate/issues/3128) ([650d5cf](https://github.com/logaretm/vee-validate/commit/650d5cf9f75f9b9247fc813acf2aff4089f05415))
- support dynamic labels closes [#3053](https://github.com/logaretm/vee-validate/issues/3053) ([31b2238](https://github.com/logaretm/vee-validate/commit/31b223878bda75c3150217ea80bb878d8dc1e320))
- typing issue from [#3134](https://github.com/logaretm/vee-validate/issues/3134) ([29e5cff](https://github.com/logaretm/vee-validate/commit/29e5cffc654a2502f29fe616eda088de958e02d3))
- use the custom injection fn for initial field values ([38cd32b](https://github.com/logaretm/vee-validate/commit/38cd32bd3ae9f263510d0ab4a1713c6a9a2011af))

### Features

- add submit count state ([#3070](https://github.com/logaretm/vee-validate/issues/3070)) ([a7fe71e](https://github.com/logaretm/vee-validate/commit/a7fe71e01072dacfeb7baa80eebf0b8d7d9d3ffd))
- added context awareness to composition helpers for fields ([b59fe88](https://github.com/logaretm/vee-validate/commit/b59fe88197ce3cd587edfc33666bcb676030fa61))
- added context information to validation functions ([7e6675d](https://github.com/logaretm/vee-validate/commit/7e6675db6a103eae33cbb6d959621b4549af66b2))
- added test cases and fallbacks for unresolved cases ([71bda03](https://github.com/logaretm/vee-validate/commit/71bda03a72a9e8f27bc0b7620ce78ba48a194309))
- added the useResetForm helper ([4c57715](https://github.com/logaretm/vee-validate/commit/4c57715ab621526a5c987cff9a53cb5b7af2155a))
- added unchecked-value prop to the field component ([af910c3](https://github.com/logaretm/vee-validate/commit/af910c3f3c6343538658ab90f356dd8957bb6a1a))
- added useErrors and useField error helpers ([4cda2fe](https://github.com/logaretm/vee-validate/commit/4cda2fea6428a7f10b53b633daa46252bf779289))
- added useIsDirty helpers ([6b7e4ab](https://github.com/logaretm/vee-validate/commit/6b7e4abfcdb2f0eebe0dd8c62785178fbee8d25f))
- added useIsSubmitting helper ([7a58fd8](https://github.com/logaretm/vee-validate/commit/7a58fd840425a5e09f625054389aebbb096c2e1a))
- added useIsTouched helpers ([fdb2d5a](https://github.com/logaretm/vee-validate/commit/fdb2d5a3c7c82d55aefef2deb95823e1ba6ba93d))
- added useIsValid helpers ([26fbb29](https://github.com/logaretm/vee-validate/commit/26fbb29467bab66c159e98793e4269768845b938))
- added useSubmitCount helper ([c4a6dea](https://github.com/logaretm/vee-validate/commit/c4a6deae68b588494ff0e2477d7ec2b9302c6f09))
- added useSubmitForm hook ([#3101](https://github.com/logaretm/vee-validate/issues/3101)) ([d042882](https://github.com/logaretm/vee-validate/commit/d04288295a090328f7022641799dbaee1c404b91))
- added useValidateField and useValidateForm helpers ([62355a8](https://github.com/logaretm/vee-validate/commit/62355a8db6477562f0689208669d0a1be63de03c))
- added validate field function to form and useForm ([#3133](https://github.com/logaretm/vee-validate/issues/3133)) ([926bed1](https://github.com/logaretm/vee-validate/commit/926bed1bded6990f17a51ca68e9aa47c339a80f2))
- added validate method on the form ref instance closes [#3030](https://github.com/logaretm/vee-validate/issues/3030) ([ed0faff](https://github.com/logaretm/vee-validate/commit/ed0faffd79615830a9f7c247abf1eae2254ee3f9))
- added validation trigger config per component closes [#3066](https://github.com/logaretm/vee-validate/issues/3066) ([f0e30a2](https://github.com/logaretm/vee-validate/commit/f0e30a2cc79843040028b7070bc88846f2447c85))
- added value change support for native multi select ([#3146](https://github.com/logaretm/vee-validate/issues/3146)) ([0601586](https://github.com/logaretm/vee-validate/commit/0601586eabbf76fac9d4fa79e6ae1d86fd3a0e37))
- added values helpers ([e0f16d6](https://github.com/logaretm/vee-validate/commit/e0f16d6f5c01c7b1e4e8832b3490b8cc7e7b8aa7))
- added warnings for non existent fields and allow reactive paths ([4182d2f](https://github.com/logaretm/vee-validate/commit/4182d2f1716d712962dff3b6be27916e311e5870))
- avoid watching rules when passed as functions ([539f753](https://github.com/logaretm/vee-validate/commit/539f7535bf935e62030b83f8c7b19e95256bcc52))
- dont render any tags when no message exists closes [#3118](https://github.com/logaretm/vee-validate/issues/3118) ([92eba41](https://github.com/logaretm/vee-validate/commit/92eba41a2cdef643bc2af4c2a0366382cdffc625))
- enhance ts typing for form functions ([8f7d8e8](https://github.com/logaretm/vee-validate/commit/8f7d8e89864b5df5255cbe5e88713022537ec236))
- enhance useField types ([dcb8049](https://github.com/logaretm/vee-validate/commit/dcb80495ffdefb2e789887e1d40b2c4a57ade257))
- enrich form validation results ([0c84c80](https://github.com/logaretm/vee-validate/commit/0c84c809fa729cd2b8620329305b4da0a45e9eaf))
- export some internal types closes [#3065](https://github.com/logaretm/vee-validate/issues/3065) ([b88dffd](https://github.com/logaretm/vee-validate/commit/b88dffdb4c638bd439d093f653bfa1915f4ad9be))
- field.reset() should reset the field to its initial value ([a11f1b7](https://github.com/logaretm/vee-validate/commit/a11f1b7dda3deafe683e13a00b28a7fab09b82cb))
- implement similar reset API for fields ([38c3923](https://github.com/logaretm/vee-validate/commit/38c392320b4154061ccc5d70dde11517357467e8))
- new reset API ([6983738](https://github.com/logaretm/vee-validate/commit/69837383e42636c24d6ee7d15cb5fe8e98f2ac55))
- rename reset methods to be more consistent ([3a0dc4d](https://github.com/logaretm/vee-validate/commit/3a0dc4db2f1a00a8a4f3940ddd452d9b1369cace))
- update docs ([0f5ac98](https://github.com/logaretm/vee-validate/commit/0f5ac98153f74bdbbd1d9f5090e4dc4b438c998f))
- use internal yup types ([#3123](https://github.com/logaretm/vee-validate/issues/3123)) ([7554bfc](https://github.com/logaretm/vee-validate/commit/7554bfc49b0103f218f901148bc06e6a455f09b0))
- use resolveDynamicComponent instead ([f1b5f89](https://github.com/logaretm/vee-validate/commit/f1b5f896840ed159df06cf59badd83282496b777))

### Performance Improvements

- cache field props in a computed property ([d266878](https://github.com/logaretm/vee-validate/commit/d2668787d0ffcab5ba2e8be048ee7334d2b0f9e7))
- cache form slot props in a computed property ([49fa2c1](https://github.com/logaretm/vee-validate/commit/49fa2c1b4a337149c533c13725d2e71bb2664706))

## [4.1.16](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.15...vee-validate@4.1.16) (2021-02-07)

**Note:** Version bump only for package vee-validate

## [4.1.15](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.14...vee-validate@4.1.15) (2021-02-07)

### Bug Fixes

- resolve path values with global rules closes [#3157](https://github.com/logaretm/vee-validate/issues/3157) ([beaf316](https://github.com/logaretm/vee-validate/commit/beaf3168490aee585542a19c9a910d9493e78208))

## [4.1.14](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.13...vee-validate@4.1.14) (2021-02-06)

### Bug Fixes

- avoid validating dependencies via watcheffect closes [#3156](https://github.com/logaretm/vee-validate/issues/3156) ([a7b91f6](https://github.com/logaretm/vee-validate/commit/a7b91f6e6c38f0b5262e2d4c1814154efa3b78c8))

## [4.1.13](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.12...vee-validate@4.1.13) (2021-02-01)

### Features

- added value change support for native multi select ([#3146](https://github.com/logaretm/vee-validate/issues/3146)) ([0601586](https://github.com/logaretm/vee-validate/commit/0601586eabbf76fac9d4fa79e6ae1d86fd3a0e37))

## [4.1.12](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.11...vee-validate@4.1.12) (2021-01-26)

### Bug Fixes

- array radio fields not switching value correctly closes [#3141](https://github.com/logaretm/vee-validate/issues/3141) ([3d4efef](https://github.com/logaretm/vee-validate/commit/3d4efef68c63a3b57e2bf14fed913dbf841a7f5e))
- clear out initial values for unregistered fields closes [#3060](https://github.com/logaretm/vee-validate/issues/3060) ([56206de](https://github.com/logaretm/vee-validate/commit/56206de995fe8f2eaca3e303ab6980784a3c95b1))
- typing issue from [#3134](https://github.com/logaretm/vee-validate/issues/3134) ([29e5cff](https://github.com/logaretm/vee-validate/commit/29e5cffc654a2502f29fe616eda088de958e02d3))

## [4.1.11](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.10...vee-validate@4.1.11) (2021-01-19)

### Features

- added validate field function to form and useForm ([#3133](https://github.com/logaretm/vee-validate/issues/3133)) ([926bed1](https://github.com/logaretm/vee-validate/commit/926bed1bded6990f17a51ca68e9aa47c339a80f2))

## [4.1.10](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.9...vee-validate@4.1.10) (2021-01-17)

### Bug Fixes

- set field initial value on the fid lookup closes [#3128](https://github.com/logaretm/vee-validate/issues/3128) ([650d5cf](https://github.com/logaretm/vee-validate/commit/650d5cf9f75f9b9247fc813acf2aff4089f05415))

## [4.1.9](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.8...vee-validate@4.1.9) (2021-01-13)

### Features

- use internal yup types ([#3123](https://github.com/logaretm/vee-validate/issues/3123)) ([7554bfc](https://github.com/logaretm/vee-validate/commit/7554bfc49b0103f218f901148bc06e6a455f09b0))

## [4.1.8](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.7...vee-validate@4.1.8) (2021-01-12)

### Features

- dont render any tags when no message exists closes [#3118](https://github.com/logaretm/vee-validate/issues/3118) ([92eba41](https://github.com/logaretm/vee-validate/commit/92eba41a2cdef643bc2af4c2a0366382cdffc625))

## [4.1.7](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.6...vee-validate@4.1.7) (2021-01-12)

### Bug Fixes

- export submission types [#3112](https://github.com/logaretm/vee-validate/issues/3112) ([3f35167](https://github.com/logaretm/vee-validate/commit/3f351670da02364b0fb8e61198145dfa02dc59b9))

## [4.1.6](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.5...vee-validate@4.1.6) (2021-01-11)

### Bug Fixes

- added emits and onSubmit custom prop ([#3115](https://github.com/logaretm/vee-validate/issues/3115)) ([8f2c110](https://github.com/logaretm/vee-validate/commit/8f2c110f14add0fbd82a28a91601e89938144624))

## [4.1.5](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.4...vee-validate@4.1.5) (2021-01-05)

### Bug Fixes

- correctly set the initial value from the v-model closes [#3107](https://github.com/logaretm/vee-validate/issues/3107) ([4bed9a8](https://github.com/logaretm/vee-validate/commit/4bed9a806323139d2f274e51b6bfe3de2190e54d))

## [4.1.4](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.3...vee-validate@4.1.4) (2021-01-04)

### Bug Fixes

- handle formless checkboxes value toggling closes [#3105](https://github.com/logaretm/vee-validate/issues/3105) ([504f30b](https://github.com/logaretm/vee-validate/commit/504f30bfcbcb1db710397ef05545b5008b0103fb))

## [4.1.3](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.2...vee-validate@4.1.3) (2021-01-02)

### Features

- enhance useField types ([dcb8049](https://github.com/logaretm/vee-validate/commit/dcb80495ffdefb2e789887e1d40b2c4a57ade257))

## [4.1.2](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.1...vee-validate@4.1.2) (2020-12-26)

### Features

- added useSubmitForm hook ([#3101](https://github.com/logaretm/vee-validate/issues/3101)) ([d042882](https://github.com/logaretm/vee-validate/commit/d04288295a090328f7022641799dbaee1c404b91))

## [4.1.1](https://github.com/logaretm/vee-validate/compare/vee-validate@4.1.0...vee-validate@4.1.1) (2020-12-18)

### Bug Fixes

- missing export for useErrors helpers ([28537cc](https://github.com/logaretm/vee-validate/commit/28537cc547cf945b10adc485620ad226f71d60fc))

# [4.1.0](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.7...vee-validate@4.1.0) (2020-12-18)

### Bug Fixes

- avoid returning undefined for form errors when form does not exist ([8cce17a](https://github.com/logaretm/vee-validate/commit/8cce17ae2846be912d51926c79e557ed8bb39582))

### Features

- added context awareness to composition helpers for fields ([b59fe88](https://github.com/logaretm/vee-validate/commit/b59fe88197ce3cd587edfc33666bcb676030fa61))
- added test cases and fallbacks for unresolved cases ([71bda03](https://github.com/logaretm/vee-validate/commit/71bda03a72a9e8f27bc0b7620ce78ba48a194309))
- added the useResetForm helper ([4c57715](https://github.com/logaretm/vee-validate/commit/4c57715ab621526a5c987cff9a53cb5b7af2155a))
- added useErrors and useField error helpers ([4cda2fe](https://github.com/logaretm/vee-validate/commit/4cda2fea6428a7f10b53b633daa46252bf779289))
- added useIsDirty helpers ([6b7e4ab](https://github.com/logaretm/vee-validate/commit/6b7e4abfcdb2f0eebe0dd8c62785178fbee8d25f))
- added useIsSubmitting helper ([7a58fd8](https://github.com/logaretm/vee-validate/commit/7a58fd840425a5e09f625054389aebbb096c2e1a))
- added useIsTouched helpers ([fdb2d5a](https://github.com/logaretm/vee-validate/commit/fdb2d5a3c7c82d55aefef2deb95823e1ba6ba93d))
- added useIsValid helpers ([26fbb29](https://github.com/logaretm/vee-validate/commit/26fbb29467bab66c159e98793e4269768845b938))
- added useSubmitCount helper ([c4a6dea](https://github.com/logaretm/vee-validate/commit/c4a6deae68b588494ff0e2477d7ec2b9302c6f09))
- added useValidateField and useValidateForm helpers ([62355a8](https://github.com/logaretm/vee-validate/commit/62355a8db6477562f0689208669d0a1be63de03c))
- added values helpers ([e0f16d6](https://github.com/logaretm/vee-validate/commit/e0f16d6f5c01c7b1e4e8832b3490b8cc7e7b8aa7))
- added warnings for non existent fields and allow reactive paths ([4182d2f](https://github.com/logaretm/vee-validate/commit/4182d2f1716d712962dff3b6be27916e311e5870))
- enhance ts typing for form functions ([8f7d8e8](https://github.com/logaretm/vee-validate/commit/8f7d8e89864b5df5255cbe5e88713022537ec236))
- enrich form validation results ([0c84c80](https://github.com/logaretm/vee-validate/commit/0c84c809fa729cd2b8620329305b4da0a45e9eaf))
- export some internal types closes [#3065](https://github.com/logaretm/vee-validate/issues/3065) ([b88dffd](https://github.com/logaretm/vee-validate/commit/b88dffdb4c638bd439d093f653bfa1915f4ad9be))

## [4.0.7](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.6...vee-validate@4.0.7) (2020-12-18)

### Bug Fixes

- react to validation events changes ([078e61b](https://github.com/logaretm/vee-validate/commit/078e61b17bd299a28752b733b494a0ddb368a812))

## [4.0.6](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.5...vee-validate@4.0.6) (2020-12-15)

### Bug Fixes

- prevent default reset behavior with handleReset ([a66df13](https://github.com/logaretm/vee-validate/commit/a66df13c3f39d84984581dc3c0ce368b052b6e8e))
- prevent resetForm from toggling checkbox value [#3084](https://github.com/logaretm/vee-validate/issues/3084) ([38778f9](https://github.com/logaretm/vee-validate/commit/38778f96471b6aa16fb020cfb1bde56b77a19cfb))

### Features

- added unchecked-value prop to the field component ([af910c3](https://github.com/logaretm/vee-validate/commit/af910c3f3c6343538658ab90f356dd8957bb6a1a))

### Performance Improvements

- cache field props in a computed property ([d266878](https://github.com/logaretm/vee-validate/commit/d2668787d0ffcab5ba2e8be048ee7334d2b0f9e7))
- cache form slot props in a computed property ([49fa2c1](https://github.com/logaretm/vee-validate/commit/49fa2c1b4a337149c533c13725d2e71bb2664706))

## [4.0.5](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.4...vee-validate@4.0.5) (2020-12-12)

### Features

- added validation trigger config per component closes [#3066](https://github.com/logaretm/vee-validate/issues/3066) ([f0e30a2](https://github.com/logaretm/vee-validate/commit/f0e30a2cc79843040028b7070bc88846f2447c85))

## [4.0.4](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.3...vee-validate@4.0.4) (2020-12-09)

### Bug Fixes

- add a handler for regex object params closes [#3073](https://github.com/logaretm/vee-validate/issues/3073) ([7a5e2eb](https://github.com/logaretm/vee-validate/commit/7a5e2ebf8303395372ae08ebcca55427a58faecb))
- fill the target rule params for message generators closes [#3077](https://github.com/logaretm/vee-validate/issues/3077) ([f5e1bd3](https://github.com/logaretm/vee-validate/commit/f5e1bd3cbc278a8588fa0c96af66823d82eefb8c))

### Features

- add submit count state ([#3070](https://github.com/logaretm/vee-validate/issues/3070)) ([a7fe71e](https://github.com/logaretm/vee-validate/commit/a7fe71e01072dacfeb7baa80eebf0b8d7d9d3ffd))

## [4.0.3](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.2...vee-validate@4.0.3) (2020-12-05)

### Bug Fixes

- cast radio buttons value correctly closes [#3064](https://github.com/logaretm/vee-validate/issues/3064) ([3e0f9a4](https://github.com/logaretm/vee-validate/commit/3e0f9a47369edac32d0c8a068f8b61d8f761458f))
- reset meta correctly with resetField ([012658c](https://github.com/logaretm/vee-validate/commit/012658c082a00b1beeb53ce8cf3fcd91bc5b21ec))
- use the custom injection fn for initial field values ([38cd32b](https://github.com/logaretm/vee-validate/commit/38cd32bd3ae9f263510d0ab4a1713c6a9a2011af))

## [4.0.2](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.1...vee-validate@4.0.2) (2020-11-27)

### Bug Fixes

- support dynamic labels closes [#3053](https://github.com/logaretm/vee-validate/issues/3053) ([31b2238](https://github.com/logaretm/vee-validate/commit/31b223878bda75c3150217ea80bb878d8dc1e320))

## [4.0.1](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0...vee-validate@4.0.1) (2020-11-25)

### Bug Fixes

- pass down listeners to the input node closes [#3048](https://github.com/logaretm/vee-validate/issues/3048) ([2526a63](https://github.com/logaretm/vee-validate/commit/2526a63c2361e412b528cf370c03b39cb84b606d))

# [4.0.0](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.19...vee-validate@4.0.0) (2020-11-16)

### Features

- added validate method on the form ref instance closes [#3030](https://github.com/logaretm/vee-validate/issues/3030) ([ed0faff](https://github.com/logaretm/vee-validate/commit/ed0faffd79615830a9f7c247abf1eae2254ee3f9))
- update docs ([0f5ac98](https://github.com/logaretm/vee-validate/commit/0f5ac98153f74bdbbd1d9f5090e4dc4b438c998f))

# [4.0.0-beta.19](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.18...vee-validate@4.0.0-beta.19) (2020-11-07)

### Bug Fixes

- resolve component before rendering closes [#3014](https://github.com/logaretm/vee-validate/issues/3014) ([f8f481d](https://github.com/logaretm/vee-validate/commit/f8f481daad754a4b18a91e2b07b9549433d023f9))

### Features

- field.reset() should reset the field to its initial value ([a11f1b7](https://github.com/logaretm/vee-validate/commit/a11f1b7dda3deafe683e13a00b28a7fab09b82cb))
- implement similar reset API for fields ([38c3923](https://github.com/logaretm/vee-validate/commit/38c392320b4154061ccc5d70dde11517357467e8))
- new reset API ([6983738](https://github.com/logaretm/vee-validate/commit/69837383e42636c24d6ee7d15cb5fe8e98f2ac55))
- rename reset methods to be more consistent ([3a0dc4d](https://github.com/logaretm/vee-validate/commit/3a0dc4db2f1a00a8a4f3940ddd452d9b1369cace))
- use resolveDynamicComponent instead ([f1b5f89](https://github.com/logaretm/vee-validate/commit/f1b5f896840ed159df06cf59badd83282496b777))

# [4.0.0-beta.18](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.17...vee-validate@4.0.0-beta.18) (2020-11-05)

### Bug Fixes

- handle reactive field names and value swaps ([cf8051d](https://github.com/logaretm/vee-validate/commit/cf8051d3b92eb43103f4e7c682e615343239d717))

### Features

- avoid watching rules when passed as functions ([539f753](https://github.com/logaretm/vee-validate/commit/539f7535bf935e62030b83f8c7b19e95256bcc52))

# [4.0.0-beta.17](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.16...vee-validate@4.0.0-beta.17) (2020-11-04)

### Features

- added context information to validation functions ([7e6675d](https://github.com/logaretm/vee-validate/commit/7e6675db6a103eae33cbb6d959621b4549af66b2))

# [4.0.0-beta.16](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.15...vee-validate@4.0.0-beta.16) (2020-10-29)

### Features

- initial form meta ([#3003](https://github.com/logaretm/vee-validate/issues/3003)) ([f7fd407](https://github.com/logaretm/vee-validate/commit/f7fd407cf0e6dad9c92585a4a82594af962de8f4))

# [4.0.0-beta.15](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.14...vee-validate@4.0.0-beta.15) (2020-10-28)

### Features

- add `initialErrors` prop ([#3002](https://github.com/logaretm/vee-validate/issues/3002)) ([9850b3f](https://github.com/logaretm/vee-validate/commit/9850b3f2f1c1739f31ff05f32890196097ef426e))

# [4.0.0-beta.14](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.13...vee-validate@4.0.0-beta.14) (2020-10-26)

### Features

- deprecate the disabled prop ([29f4dca](https://github.com/logaretm/vee-validate/commit/29f4dca6bd4d02281bf71f8ed4c836f30e0e46d0))
- use injection keys to type inject API ([79207b2](https://github.com/logaretm/vee-validate/commit/79207b25a23782acc527394af23703b138c881db))

# [4.0.0-beta.13](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.12...vee-validate@4.0.0-beta.13) (2020-10-23)

### Features

- `useForm` Field types ([#2996](https://github.com/logaretm/vee-validate/issues/2996)) ([727f229](https://github.com/logaretm/vee-validate/commit/727f2295d421ef92620995a356bcaee53770299b))

# [4.0.0-beta.12](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.11...vee-validate@4.0.0-beta.12) (2020-10-21)

### Bug Fixes

- upgrade to Vue 3.0.2 and fix broken cases ([ede7214](https://github.com/logaretm/vee-validate/commit/ede72147bd998b888825457541ff964df5e7a2fd))

# [4.0.0-beta.11](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.10...vee-validate@4.0.0-beta.11) (2020-10-18)

### Bug Fixes

- provide yup object schema type to the useForm closes [#2988](https://github.com/logaretm/vee-validate/issues/2988) ([29157f7](https://github.com/logaretm/vee-validate/commit/29157f7a36dd14dc9a6c411ffddbbeb9d3749f6e))

# [4.0.0-beta.10](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.9...vee-validate@4.0.0-beta.10) (2020-10-15)

### Bug Fixes

- properly initialize initial values closes [#2978](https://github.com/logaretm/vee-validate/issues/2978) ([c0ba699](https://github.com/logaretm/vee-validate/commit/c0ba699757cbd2c3ab409d5ee8d2fa3a205907d8))
- typos in test descriptions ([#2970](https://github.com/logaretm/vee-validate/issues/2970)) ([a0132df](https://github.com/logaretm/vee-validate/commit/a0132dfcc2aab4ba48f175b846228544c80fe4a8))

# [4.0.0-beta.9](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.8...vee-validate@4.0.0-beta.9) (2020-10-14)

### Bug Fixes

- improve useForm meta types ([#2963](https://github.com/logaretm/vee-validate/issues/2963)) ([6b46047](https://github.com/logaretm/vee-validate/commit/6b46047278633a095243fcce4ba94ddd94e08c11))

### Features

- meta setters ([#2967](https://github.com/logaretm/vee-validate/issues/2967)) ([5036e13](https://github.com/logaretm/vee-validate/commit/5036e13e0f5974589387746398446fa5f318dc0d))

# [4.0.0-beta.8](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.7...vee-validate@4.0.0-beta.8) (2020-10-12)

### Features

- added handleInput and handleBlur to field scoped slot props ([69d5833](https://github.com/logaretm/vee-validate/commit/69d5833e85d1f455fa43de83251c634b8efa89fa))
- expose reset() on the form controller object ([3229ee7](https://github.com/logaretm/vee-validate/commit/3229ee722e8df5f2e79155e1a4e5ec4729dff726))
- new meta tags API ([#2958](https://github.com/logaretm/vee-validate/issues/2958)) ([7494bfc](https://github.com/logaretm/vee-validate/commit/7494bfc6533fa29bd0668294d694aca96721d52d))
- remove aria attributes and leave it to userland ([365d825](https://github.com/logaretm/vee-validate/commit/365d825b9bc3e2955b31b941f12d5856c9be8bfe))
- remove valid fields from errors mapping ([1eee524](https://github.com/logaretm/vee-validate/commit/1eee52407f4d7156a541811053b529f7540c931c))

# [4.0.0-beta.7](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.6...vee-validate@4.0.0-beta.7) (2020-10-10)

### Bug Fixes

- avoid accessing properties in form directly to avoid warninings ([c5627af](https://github.com/logaretm/vee-validate/commit/c5627af64b252c8f7ec18e7f0a4296f315c7bf99))
- update the handleSubmit signature ([#2954](https://github.com/logaretm/vee-validate/issues/2954)) ([d17517d](https://github.com/logaretm/vee-validate/commit/d17517daf692c48ac4fa1cfce5ac0bb051e73d2e))

# [4.0.0-beta.6](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.5...vee-validate@4.0.0-beta.6) (2020-10-10)

### Features

- form and fields values setters ([#2949](https://github.com/logaretm/vee-validate/issues/2949)) ([cc2cb41](https://github.com/logaretm/vee-validate/commit/cc2cb413dfa23aefeb8be6e4bf7fa17927e0e1ce))
- reactive initial form values ([#2946](https://github.com/logaretm/vee-validate/issues/2946)) ([ac2c68f](https://github.com/logaretm/vee-validate/commit/ac2c68fdbfb7062674f8294a1f0f6d33fc8792b3))

# [4.0.0-beta.5](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.4...vee-validate@4.0.0-beta.5) (2020-10-08)

### Bug Fixes

- sync model value on input closes [#2944](https://github.com/logaretm/vee-validate/issues/2944) ([5f77fa9](https://github.com/logaretm/vee-validate/commit/5f77fa931bdb01cc6415c4edd1dcaa7eb7e1a0d2))

# [4.0.0-beta.4](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.3...vee-validate@4.0.0-beta.4) (2020-10-08)

### Bug Fixes

- prevent recursive re-render model update ([#2943](https://github.com/logaretm/vee-validate/issues/2943)) ([9fa319f](https://github.com/logaretm/vee-validate/commit/9fa319f0e42f8225565e2f54d1bebd07898574a4))
- set falsy initial values ([4b29e72](https://github.com/logaretm/vee-validate/commit/4b29e721f06fe30a5f7207935ae3d6291ea464fe))
- use validateField instead of onChange handler for blur events ([636077a](https://github.com/logaretm/vee-validate/commit/636077a35183b33372825cd4075a143383ed0c68))

# [4.0.0-beta.3](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.2...vee-validate@4.0.0-beta.3) (2020-10-06)

### Bug Fixes

- avoid toggling checkbox `checked` attr in `handleChange` ([#2937](https://github.com/logaretm/vee-validate/issues/2937)) ([b8dafbd](https://github.com/logaretm/vee-validate/commit/b8dafbdb75e305f00c6effc21391f364db9236d0))

### Features

- added `validateOnMount` prop to `Field` and `Form` components ([#2938](https://github.com/logaretm/vee-validate/issues/2938)) ([3a0d878](https://github.com/logaretm/vee-validate/commit/3a0d878e453163f305acc87c5d4c93812f77f340))

# [4.0.0-beta.2](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.1...vee-validate@4.0.0-beta.2) (2020-10-05)

### Features

- field labels ([#2933](https://github.com/logaretm/vee-validate/issues/2933)) ([513137f](https://github.com/logaretm/vee-validate/commit/513137f28c6266d3e752448b00eb1c3d410ae474))

# [4.0.0-beta.1](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-beta.0...vee-validate@4.0.0-beta.1) (2020-10-02)

### Bug Fixes

- avoid binding the value to file inputs ([02a2745](https://github.com/logaretm/vee-validate/commit/02a27456ba961540a882ec4f94a24a271b0ea3a3))

# [4.0.0-beta.0](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.14...vee-validate@4.0.0-beta.0) (2020-10-01)

### Bug Fixes

- make sure to unwrap initial value ([0298a92](https://github.com/logaretm/vee-validate/commit/0298a926de5536154a69088b55cb688133638a39))

### Features

- validation triggers ([#2927](https://github.com/logaretm/vee-validate/issues/2927)) ([e725f43](https://github.com/logaretm/vee-validate/commit/e725f43a47dd1993699c0450fd8777aa921c7a49))

# [4.0.0-alpha.14](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.13...vee-validate@4.0.0-alpha.14) (2020-09-20)

### Bug Fixes

- **core:** in case of radio or checkbox explicitly set initialValue ([#2907](https://github.com/logaretm/vee-validate/issues/2907)) ([e45ec82](https://github.com/logaretm/vee-validate/commit/e45ec82ee8fa6fabd4d3012a03ba8f9b72854631))

### Features

- use symbols to avoid provide/inject conflicts ([cc80032](https://github.com/logaretm/vee-validate/commit/cc8003213c34a8a33d84802f2c93598e1ac3c6f0))
- workspaces ([#2904](https://github.com/logaretm/vee-validate/issues/2904)) ([0c05f94](https://github.com/logaretm/vee-validate/commit/0c05f9486a73744273de6816f00f689916aba91c))

# [4.0.0-alpha.13](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.12...vee-validate@4.0.0-alpha.13) (2020-09-16)

### Features

- nested objects/arrays ([#2897](https://github.com/logaretm/vee-validate/issues/2897)) ([8d161a1](https://github.com/logaretm/vee-validate/commit/8d161a137a65c90ec8f7189743be24802231cf29))

# [4.0.0-alpha.12](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.11...vee-validate@4.0.0-alpha.12) (2020-09-15)

### Features

- cast single checkboxes values to booleans closes [#2889](https://github.com/logaretm/vee-validate/issues/2889) ([7a08184](https://github.com/logaretm/vee-validate/commit/7a081845ac6a4bc09c51e52c5996b65814a48baf))
- invoke generateMessage handler for local functions closes [#2893](https://github.com/logaretm/vee-validate/issues/2893) ([e9fe773](https://github.com/logaretm/vee-validate/commit/e9fe77365877edda51548c9539ec085fff91586b))

# [4.0.0-alpha.11](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.10...vee-validate@4.0.0-alpha.11) (2020-09-02)

**Note:** Version bump only for package vee-validate

# [4.0.0-alpha.10](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.9...vee-validate@4.0.0-alpha.10) (2020-08-29)

### Bug Fixes

- added temporary fix for [#2873](https://github.com/logaretm/vee-validate/issues/2873) with form meta ([6e1bf17](https://github.com/logaretm/vee-validate/commit/6e1bf176e7ba5c890afab6c11731dac54924d39b))

# [4.0.0-alpha.9](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.8...vee-validate@4.0.0-alpha.9) (2020-08-28)

### Bug Fixes

- adapt to the breaking changes in #vue-1682 closes [#2873](https://github.com/logaretm/vee-validate/issues/2873) ([05f7df3](https://github.com/logaretm/vee-validate/commit/05f7df313f9f47ca79bdf99be35cb2ccfea0c346))

# [4.0.0-alpha.8](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.7...vee-validate@4.0.0-alpha.8) (2020-08-13)

### Bug Fixes

- detect initial values from v-model ([e566302](https://github.com/logaretm/vee-validate/commit/e566302bb485353f03baccdf98f35a255605e15d))
- handle unmount issue when removed value is falsy for checkboxes ([b6393f4](https://github.com/logaretm/vee-validate/commit/b6393f4adce9346cadaf1f423dca29645bf3c2f1))
- initial array values for checkboxes not populated correctly in form ([fb99edc](https://github.com/logaretm/vee-validate/commit/fb99edc309c26f9be2baa71f90ec1ac59ddcdc9d))
- umounting group of checkbox issues ([8c77af5](https://github.com/logaretm/vee-validate/commit/8c77af52955b235a6bd2357a35036097e109e37f))

### Features

- added basic v-model support ([c93d125](https://github.com/logaretm/vee-validate/commit/c93d125b4d6c0af8365920ee577c883493e60648))
- merge ctx.attrs to any rendered root node ([5c9979c](https://github.com/logaretm/vee-validate/commit/5c9979ce45d4ab10cd019ad0c25159e013198301))
- sync the model value with inner value ([57d7923](https://github.com/logaretm/vee-validate/commit/57d79232f490be3525c2576ef83376a2f5643386))

# [4.0.0-alpha.7](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.6...vee-validate@4.0.0-alpha.7) (2020-08-04)

### Bug Fixes

- avoid removing array value for a non-group field closes [#2847](https://github.com/logaretm/vee-validate/issues/2847) ([69f2092](https://github.com/logaretm/vee-validate/commit/69f2092db7d53665986dd384cae561d1b13bd8f5))
- bails affects yup non-object validators ([a50645b](https://github.com/logaretm/vee-validate/commit/a50645b1c0206d0e7d85ec6681ff6dc224536fa2))
- initial values on HTML inputs ([c4f4eb9](https://github.com/logaretm/vee-validate/commit/c4f4eb9fe97b13fedb93ac760614eb53c177ffb3))

### Features

- deprecate the skipOptional config ([e62f5ea](https://github.com/logaretm/vee-validate/commit/e62f5ea6d31e82ac9f257627e8544431b933c4f9))

# [4.0.0-alpha.6](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.5...vee-validate@4.0.0-alpha.6) (2020-07-27)

### Bug Fixes

- render input tags by default for the field component ([858c47b](https://github.com/logaretm/vee-validate/commit/858c47b4a7fa740611abaf026e6e5db6cdb41050))

# [4.0.0-alpha.5](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.4...vee-validate@4.0.0-alpha.5) (2020-07-24)

### Bug Fixes

- unregister fields once they are unmounted ([0d601cb](https://github.com/logaretm/vee-validate/commit/0d601cb60b3ba907e6c0d73dd129c0c7b086316e))

### Features

- **v4:** add checkbox and radio HTML input support ([#2835](https://github.com/logaretm/vee-validate/issues/2835)) ([ab3d499](https://github.com/logaretm/vee-validate/commit/ab3d4998caf5950656dc0476f13215d598b28832))
- render input by default for the field component ([81d055d](https://github.com/logaretm/vee-validate/commit/81d055d704deaa12b392fd9197218733b3a0bb8d))

# [4.0.0-alpha.4](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.3...vee-validate@4.0.0-alpha.4) (2020-07-23)

**Note:** Version bump only for package vee-validate

# [4.0.0-alpha.3](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.2...vee-validate@4.0.0-alpha.3) (2020-07-21)

### Features

- automatic injection of the form controller ([c039831](https://github.com/logaretm/vee-validate/commit/c0398318ec70c925b6bcb2afa859ec89488e1f78))
- remove debounce feature and make it userland ([b7263ce](https://github.com/logaretm/vee-validate/commit/b7263ce0f887388709846975b59965e440636089))

# [4.0.0-alpha.2](https://github.com/logaretm/vee-validate/compare/vee-validate@4.0.0-alpha.1...vee-validate@4.0.0-alpha.2) (2020-07-19)

### Features

- always render a from by default ([402603a](https://github.com/logaretm/vee-validate/commit/402603a8f755a377a056debf24815611a01c3037))

# 4.0.0-alpha.1 (2020-07-18)

### Bug Fixes

- added check for cross-fields extraction on unsupported schema ([0ff1bad](https://github.com/logaretm/vee-validate/commit/0ff1bad84a90189f11897cada01fd091e5593bb7))
- added errorMessage prop to the field type ([f1553d0](https://github.com/logaretm/vee-validate/commit/f1553d01b94a74580700fd8712b67688f9c89c15))
- added single error message prop to the provider slot props ([bc97d0c](https://github.com/logaretm/vee-validate/commit/bc97d0c6463cd7e466bb7b3555671e7891d4c60b))
- added unwrap util function ([121bffc](https://github.com/logaretm/vee-validate/commit/121bffc05a9c6e2e204b843d5eb8d7678e5d0fff))
- adjust the useField options to be less strict ([7ea8263](https://github.com/logaretm/vee-validate/commit/7ea826373a78b4fa6343f1da9db0e43879fa0e4e))
- check if a form is present before accessing its schema ([3656181](https://github.com/logaretm/vee-validate/commit/3656181b17a6e44c8f470570ee5126cf2a83ae41))
- debouncing not working correctly and move it to hoc only ([86280a1](https://github.com/logaretm/vee-validate/commit/86280a15e9fb1f94ef8c042a9d04d437f38936b0))
- ensure we unwrap the field id if it was reactive ([7f91e93](https://github.com/logaretm/vee-validate/commit/7f91e930ec8cce4f2e17b49ee9d642d7e9343d6f))
- initial validation not respecting the config opts ([2443d44](https://github.com/logaretm/vee-validate/commit/2443d44b1b00eda39ff884f33f85414aa2b1d34e))
- localization default fallback not being interpolated correctly ([165e89c](https://github.com/logaretm/vee-validate/commit/165e89c6136126d6b946640623261f32b299a2a3))
- no clue why this isn't building ([0d3e7fd](https://github.com/logaretm/vee-validate/commit/0d3e7fdea6f28e29d25f488cae527e925608da7e))
- only add novalidate attr if the rendered element is form ([3638cea](https://github.com/logaretm/vee-validate/commit/3638cead19c9501783e23b43248ce49d7bdf51d7))
- param mapping causing target names to resolve incorrectly ([fb77dc6](https://github.com/logaretm/vee-validate/commit/fb77dc673cb1eff72a1508cff7b4aaed60d8450e))
- set pending back to false earlier in the cycle ([a4237a2](https://github.com/logaretm/vee-validate/commit/a4237a2f8dfde5efcc1d39b5a400e988b8740df9))
- temporary fix for the unamed import issue with vue-beta 4 ([62d27e9](https://github.com/logaretm/vee-validate/commit/62d27e9c9293026d26d62709c2e691d3eb15753e))
- unwrap flags before sending them to the observer slot ([19f7886](https://github.com/logaretm/vee-validate/commit/19f7886adae59b4442139f6e1a3f3905ab54f86a))
- use the proper model event name ([5704db8](https://github.com/logaretm/vee-validate/commit/5704db879019b89b001f496f5f113df24ad09bc6))
- watch target fields once they change ([a4184b0](https://github.com/logaretm/vee-validate/commit/a4184b0065c26df77b680cfbda7450a81b6764ef))

### Features

- adapt the changes from the v3 master branch ([2301c5a](https://github.com/logaretm/vee-validate/commit/2301c5ae75eb8590cb2cc919215ffe4ae934b885))
- add name resolution from v3 ([ba77fdd](https://github.com/logaretm/vee-validate/commit/ba77fdde4f7e5400c6755331af4705715ecc885b))
- add native submit alternative to handleSubmit ([bc00888](https://github.com/logaretm/vee-validate/commit/bc008880607f0393c4e6bd9eb2d44ebb40aa3604))
- added 'as' prop to the validation provider ([5c8ae9c](https://github.com/logaretm/vee-validate/commit/5c8ae9cac2dd418c5bf78b8a0c68e7d256dc96ce))
- added alert role to the error message ([714abfe](https://github.com/logaretm/vee-validate/commit/714abfede6cb2cd2ab1dd72319d27630af6fe9b6))
- added aria and a11y improvements ([ca74f16](https://github.com/logaretm/vee-validate/commit/ca74f165988be3c0c5a6f828508b6aed3fd6e3a0))
- added built-in support for yup validation schema ([e436b75](https://github.com/logaretm/vee-validate/commit/e436b75c4b8b7a085adf701d07b54b798da9a774))
- added ErrorMessage component ([9570412](https://github.com/logaretm/vee-validate/commit/957041270b947e1b70301c3935b6d1ac0bb05a5d))
- added support for custom components ([c661c7e](https://github.com/logaretm/vee-validate/commit/c661c7e1f352e2806c2e2da7bc2c860cfa62f3ff))
- added useField and useForm hooks ([c1e9007](https://github.com/logaretm/vee-validate/commit/c1e900736ed9585d8997d2080f001aad28060281))
- allow the as prop to be a component definition ([29790d4](https://github.com/logaretm/vee-validate/commit/29790d47f17fe49c897bf5b2fda0508f57990479))
- allow the observer to render forms and handle submit events ([9e0d59b](https://github.com/logaretm/vee-validate/commit/9e0d59b11d239c7f1e6d4bc287d9e49aa0376f0d))
- allow validation schema to accept other expressions ([ddeeaea](https://github.com/logaretm/vee-validate/commit/ddeeaea8041c3fad894aff0c827dd9f71b65224d))
- change default field value to undefiend ([00c8754](https://github.com/logaretm/vee-validate/commit/00c87549244447423e0833f8294c5c607bdcf105))
- deprecate names option on validate API ([fe90820](https://github.com/logaretm/vee-validate/commit/fe90820b4b0d4d10df81c2bbd019c3b63d371edf))
- deprecate the 'required' flag ([283caa0](https://github.com/logaretm/vee-validate/commit/283caa0fdd353d990680d42e64be8d8362b6aad5))
- enable interaction modes and localization APIs ([8486aaf](https://github.com/logaretm/vee-validate/commit/8486aaf0fadba03f38b5dd8a5ab857c10e7aa49c))
- expose errorMessage prop on useField and Provider ([04eecaa](https://github.com/logaretm/vee-validate/commit/04eecaa13cc8ab0cc18336021bb912f924e37968))
- expose the form values and pass them to the handleSubmit ([de51155](https://github.com/logaretm/vee-validate/commit/de511555c371bef73037d514e19d44eb4d292eae))
- hook up the provider with new observer implementation ([4d18a65](https://github.com/logaretm/vee-validate/commit/4d18a6572af6af4630bdc2508e027e67d3c0d579))
- implement bails for useField and ValidationProvider ([486babd](https://github.com/logaretm/vee-validate/commit/486babd031efd5a71a819ff535a0e0c661bc45fe))
- implement initial values ([8239130](https://github.com/logaretm/vee-validate/commit/82391301152751eb03097dad4521dc1c275c47e7))
- implement validation debounce ([e294409](https://github.com/logaretm/vee-validate/commit/e2944099ef2074d59f908f7949df3a1059ab3b4e))
- implemented disabled prop ([88bf28e](https://github.com/logaretm/vee-validate/commit/88bf28e89d9e635ebbc79e593a326d4dd2025cdb))
- make rules watchable ([90530cd](https://github.com/logaretm/vee-validate/commit/90530cdebede5bf33a62221371380ad8554326ba))
- make the as prop take priority to determine what to render ([d5a033f](https://github.com/logaretm/vee-validate/commit/d5a033fc57b7ddea8aff4a0f4fe802d7c2489a9c))
- new field binding object ([a58a84b](https://github.com/logaretm/vee-validate/commit/a58a84b009fef5dbfffa2a93a54643b3830cb4bc))
- new handleSubmit signature ([63cbeaf](https://github.com/logaretm/vee-validate/commit/63cbeafd1cfb5e1e14ec42e34c0691a26b258897))
- only export the provider for now ([0bf3efe](https://github.com/logaretm/vee-validate/commit/0bf3efe230be2d80b9e4693779e095c04997a52b))
- remove vid from fields ([1b9bded](https://github.com/logaretm/vee-validate/commit/1b9bdedeb68006535c7087aef267906e2f7bed1d))
- support immediate validation ([42cd6ed](https://github.com/logaretm/vee-validate/commit/42cd6edcfc0c11ea05106e66486ed4772c749548))
- support inline rules as functions ([3c74681](https://github.com/logaretm/vee-validate/commit/3c7468186ac5a6e7fa6bb44b30de4102ef5c31cd))
- support yup validation schemas on field-level ([0802512](https://github.com/logaretm/vee-validate/commit/0802512e181a8a33feaa227770f9e203fcf0cea5))
- updated vnode utils to handle Vue 3 VNode API ([29a4fe8](https://github.com/logaretm/vee-validate/commit/29a4fe859823d5a74814c2dabb3b664185e56366))
- use defineComponent to type Provider and Observer definitions ([80980cf](https://github.com/logaretm/vee-validate/commit/80980cfec81447638aa82b42c208f9ec6f9826f8))
- validate yup form schemas using object validation ([bf216dd](https://github.com/logaretm/vee-validate/commit/bf216dde30a6d90c976bac844129ccbd08a00392))
- validation schema support ([523824a](https://github.com/logaretm/vee-validate/commit/523824a0977d599f6ff2a271ee2edebd5aef36ef))
- working draft for the vprovider with composition api ([b830054](https://github.com/logaretm/vee-validate/commit/b8300547cbafa9904f2b769b8309925ad6da180f))
