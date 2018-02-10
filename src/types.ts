import {
    BlankNode,
    IndexedFormula,
    NamedNamespace,
    NamedNode,
    SomeTerm,
    Statement,
} from "rdflib";

import { ComponentStore } from "./ComponentStore";
import { LinkedDataAPI } from "./LinkedDataAPI";
import { RDFStore } from "./RDFStore";
import { Schema } from "./Schema";
import { DisjointSet } from "./utilities/DisjointSet";

export type SubscriptionCallback<T> = (v: T) => void;

export interface StatementSubscriptionRegistration {
    callback: SubscriptionCallback<Statement[]>;
    onlySubjects: false;
}

export interface NodeSubscriptionRegistration {
    callback: SubscriptionCallback<SomeNode[]>;
    onlySubjects: true;
}

export type SubscriptionRegistration = StatementSubscriptionRegistration | NodeSubscriptionRegistration;

export interface ComponentRegistration<T> {
    component: T;
    property: NamedNode;
    topology: NamedNode;
    type: NamedNode;
}

export type ResponseTransformer = (response: ResponseAndFallbacks) => Promise<Statement[]>;

export interface ErrorResponse {
    errors?: Array<{ message: string }>;
}

export interface FailedResponse {
    message: string;
    res: Response | undefined;
}

export type SomeNode = NamedNode | BlankNode;

export interface LinkedRenderStoreOptions<T> {
    api?: LinkedDataAPI | undefined;
    defaultType?: NamedNode | undefined;
    mapping?: ComponentStore<T> | undefined;
    namespaces?: NamespaceMap | undefined;
    schema?: Schema | undefined;
    store?: RDFStore | undefined;
}

export interface NamespaceMap {
    [s: string]: NamedNamespace;
}

export type LazyNNArgument = NamedNode | NamedNode[];

export type LazyIRIArgument = SomeNode | SomeNode[];

export interface ExtensionResponse {
    body: string;
    headers: { string: string };
    status: number;
    url: string;
}

export interface RDFLibFetcherRequest {
    body: string;
    headers: { string: string };
    requestedURI: string;
    status: number;
}

export type ResponseAndFallbacks = Response | XMLHttpRequest | ExtensionResponse | RDFLibFetcherRequest;

export interface WorkerMessageBase {
    method: string;
    params: object;
}

export interface GetEntityMessage {
    method: "GET_ENTITY";
    params: {
        iri: string;
    };
}

export interface VocabularyProcessingContext {
    equivalenceSet: DisjointSet<SomeTerm>;
    superMap: Map<string, Set<string>>;
    store: IndexedFormula;
}

export interface VocabularyProcessor {
    axioms: Statement[];

    processStatement: (item: Statement, ctx: VocabularyProcessingContext) => Statement[] | null;

    processType: (item: NamedNode, ctx: VocabularyProcessingContext) => boolean;
}