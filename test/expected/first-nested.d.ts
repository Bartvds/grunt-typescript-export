/// <reference path="../../typings/dummy.d.ts" />

declare module "foo" {

    import dummy = require('dummy');

    // test/fixtures/api.d.ts
    export interface Message {
        command?: string;
    }

    // test/fixtures/foo.d.ts
    export class Foo extends dummy.Dummy {
        constructor(input, output);
        public send(message): void;
    }

    // test/fixtures/bar.d.ts
    export function bar(boz): any;

}
