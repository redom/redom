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
    Q extends 'a' ? HTMLAnchorElement:
    Q extends 'area' ? HTMLAreaElement:
    Q extends 'audio' ? HTMLAudioElement:
    Q extends 'base' ? HTMLBaseElement:
    Q extends 'body' ? HTMLBodyElement:
    Q extends 'br' ? HTMLBRElement:
    Q extends 'button' ? HTMLButtonElement:
    Q extends 'canvas' ? HTMLCanvasElement:
    Q extends 'data' ? HTMLDataElement:
    Q extends 'datalist' ? HTMLDataListElement:
    Q extends 'details' ? HTMLDetailsElement:
    Q extends 'div' ? HTMLDivElement:
    Q extends 'dl' ? HTMLDListElement:
    Q extends 'embed' ? HTMLEmbedElement:
    Q extends 'fieldset' ? HTMLFieldSetElement:
    Q extends 'form' ? HTMLFormElement:
    Q extends 'hr' ? HTMLHRElement:
    Q extends 'head' ? HTMLHeadElement:
    Q extends 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' ? HTMLHeadingElement:
    Q extends 'html' ? HTMLHtmlElement:
    Q extends 'iframe' ? HTMLIFrameElement:
    Q extends 'img' ? HTMLImageElement:
    Q extends 'input' ? HTMLInputElement:
    Q extends 'label' ? HTMLLabelElement:
    Q extends 'legend' ? HTMLLegendElement:
    Q extends 'li' ? HTMLLIElement:
    Q extends 'link' ? HTMLLinkElement:
    Q extends 'map' ? HTMLMapElement:
    Q extends 'meta' ? HTMLMetaElement:
    Q extends 'meter' ? HTMLMeterElement:
    Q extends 'del' | 'ins' ? HTMLModElement:
    Q extends 'object' ? HTMLObjectElement:
    Q extends 'ol' ? HTMLOListElement:
    Q extends 'optgroup' ? HTMLOptGroupElement:
    Q extends 'option' ? HTMLOptionElement:
    Q extends 'output' ? HTMLOutputElement:
    Q extends 'p' ? HTMLParagraphElement:
    Q extends 'param' ? HTMLParamElement:
    Q extends 'pre' ? HTMLPreElement:
    Q extends 'progress' ? HTMLProgressElement:
    Q extends 'blockquote' | 'q' ? HTMLQuoteElement:
    Q extends 'script' ? HTMLScriptElement:
    Q extends 'select' ? HTMLSelectElement:
    Q extends 'slot' ? HTMLSlotElement:
    Q extends 'source' ? HTMLSourceElement:
    Q extends 'span' ? HTMLSpanElement:
    Q extends 'style' ? HTMLStyleElement:
    Q extends 'caption' ? HTMLTableCaptionElement:
    Q extends 'th' | 'td' ? HTMLTableCellElement:
    Q extends 'col' | 'colgroup' ? HTMLTableColElement:
    Q extends 'table' ? HTMLTableElement:
    Q extends 'tr' ? HTMLTableRowElement:
    Q extends 'thead' | 'tbody' | 'tfoot' ? HTMLTableSectionElement:
    Q extends 'template' ? HTMLTemplateElement:
    Q extends 'textarea' ? HTMLTextAreaElement:
    Q extends 'time' ? HTMLTimeElement:
    Q extends 'title' ? HTMLTitleElement:
    Q extends 'track' ? HTMLTrackElement:
    Q extends 'ul' ? HTMLUListElement:
    Q extends 'video' ? HTMLVideoElement:
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
