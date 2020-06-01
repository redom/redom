// Type definitions for redom 3.12
// Project: https://github.com/redom/redom/, https://redom.js.org
// Definitions by: Rauli Laine <https://github.com/RauliL>
//                 Felix Nehrke <https://github.com/nemoinho>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.2

export type RedomElement = Node | RedomComponent;
export type RedomQuery = string | RedomElement;
export type RedomMiddleware = (el: HTMLElement | SVGElement) => void;
export type RedomQueryArgumentValue = RedomElement | string | number | { [key: string]: any } | RedomMiddleware;
export type RedomQueryArgument = RedomQueryArgumentValue | RedomQueryArgumentValue[];
export type RedomElQuery = string | Node | RedomComponentCreator;

export interface RedomComponent {
    el: HTMLElement | SVGElement | RedomComponent;

    update?(item: any, index: number, data: any, context?: any): void;

    onmount?(): void;

    onremount?(): void;

    onunmount?(): void;
}

export interface RedomComponentClass {
    new (): RedomComponent;
}

export type RedomComponentConstructor = RedomComponentClass;
export type RedomComponentFactoryFunction = () => RedomComponent
export type RedomComponentCreator = RedomComponentConstructor | RedomComponentFactoryFunction

export class ListPool {
    constructor(View: RedomComponentConstructor, key?: string, initData?: any);

    update(data: any[], context?: any): void;
}

export class List implements RedomComponent {
    el: HTMLElement | SVGElement;

    constructor(parent: RedomQuery, View: RedomComponentCreator, key?: string, initData?: any);

    update(data: any[], context?: any): void;

    onmount?(): void;

    onremount?(): void;

    onunmount?(): void;

    static extend(parent: RedomQuery, View: RedomComponentConstructor, key?: string, initData?: any): RedomComponentConstructor;
}

export class Place implements RedomComponent {
    el: HTMLElement | SVGElement;

    constructor(View: RedomComponentConstructor, initData?: any);

    update(visible: boolean, data?: any): void;
}

export class Router implements RedomComponent {
    el: HTMLElement | SVGElement;

    constructor(parent: RedomQuery, Views: RouterDictionary, initData?: any);

    update(route: string, data?: any): void;
}

export interface RouterDictionary {
    [key: string]: RedomComponentConstructor;
}

type HTMLElementOfStringLiteral<Q extends string> =
    Q extends 'div' ? HTMLDivElement:
    Q extends 'a' ? HTMLAnchorElement:
    Q extends 'span' ? HTMLSpanElement:
    Q extends 'pre' ? HTMLPreElement:
    Q extends 'p' ? HTMLParagraphElement:
    Q extends 'hr' ? HTMLHRElement:
    Q extends 'br' ? HTMLBRElement:
    Q extends 'img' ? HTMLImageElement:
    Q extends 'iframe' ? HTMLIFrameElement:
    Q extends 'ul' ? HTMLUListElement:
    Q extends 'li' ? HTMLLIElement:
    Q extends 'ol' ? HTMLOListElement:
    Q extends 'form' ? HTMLFormElement:
    Q extends 'input' ? HTMLInputElement:
    Q extends 'label' ? HTMLLabelElement:
    Q extends 'textarea' ? HTMLTextAreaElement:
    Q extends 'select' ? HTMLSelectElement:
    Q extends 'option' ? HTMLOptionElement:
    Q extends 'button' ? HTMLButtonElement:
    Q extends 'h1'|'h2'|'h3'|'h4'|'h5'|'h6' ? HTMLHeadingElement:
    Q extends 'table' ? HTMLTableElement:
    Q extends 'tr' ? HTMLTableRowElement:
    Q extends 'td' ? HTMLTableCellElement:
    Q extends 'thead'|'tbody'|'tfoot' ? HTMLTableSectionElement:
    Q extends 'th' ? HTMLTableHeaderCellElement:
    Q extends 'style' ? HTMLStyleElement:
    Q extends 'svg' ? SVGElement:
    HTMLElement

type RedomElementOfElQuery<Q extends RedomElQuery> =
    Q extends Node ? Q:
    Q extends RedomComponentClass ? InstanceType<Q>:
    Q extends RedomComponentFactoryFunction ? ReturnType<Q>:
    Q extends string ? HTMLElementOfStringLiteral<Q>:
    never

export function html<Q extends RedomElQuery>(query: Q, ...args: RedomQueryArgument[]): RedomElementOfElQuery<Q>;
export function h<Q extends RedomElQuery>(query: Q, ...args: RedomQueryArgument[]): RedomElementOfElQuery<Q>;
export function el<Q extends RedomElQuery>(query: Q, ...args: RedomQueryArgument[]): RedomElementOfElQuery<Q>;

export function listPool(View: RedomComponentConstructor, key?: string, initData?: any): ListPool;
export function list(parent: RedomQuery, View: RedomComponentConstructor, key?: string, initData?: any): List;

export function mount(parent: RedomElement, child: RedomElement, before?: RedomElement, replace?: boolean): RedomElement;
export function unmount(parent: RedomElement, child: RedomElement): RedomElement;

export function place(View: RedomComponentConstructor, initData?: any): Place;

export function router(parent: RedomQuery, Views: RouterDictionary, initData?: any): Router;

export function setAttr(view: RedomElement, arg1: string | object, arg2?: string): void;

export function setStyle(view: RedomElement, arg1: string | object, arg2?: string): void;

export function setChildren(parent: RedomElement, children: RedomElement[]): void;

export function svg(query: RedomQuery, ...args: RedomQueryArgument[]): SVGElement;
export function s(query: RedomQuery, ...args: RedomQueryArgument[]): SVGElement;

export function text(str: string): Text;

export namespace list {
    function extend(parent: RedomQuery, View: RedomComponentConstructor, key?: string, initData?: any): RedomComponentConstructor;
}

export namespace svg {
    function extend(query: RedomQuery): RedomComponentConstructor;
}
