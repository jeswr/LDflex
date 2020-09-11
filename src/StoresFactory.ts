/**
 * Used to set-up configuration across multiple
 */
// TODO: EMIT NOTIFICANTIONS / REQUEST FOR AUTH DETAILS

import CommunicaEngine from '../../../comunica-test-3/LDflex-Comunica/src'//'comunica-test-3/LDflex-Comunica/src/index';
import { NamedNode } from "rdf-js";
import PathFactory from "./PathFactory";
// import { jsonLDContext, path, pathData, queryEngine } from "../types";

import { Store } from 'n3'
import { blankNode, namedNode } from '@rdfjs/data-model';
import { JsonLdContext } from 'jsonld-context-parser';
import { Repeater } from '@repeaterjs/repeater'
import { hashCode } from './utils'

type storeList = { pathFactory: PathFactory, read: boolean, write: boolean }[]

type baseStore = 
    // | PathFactory 
    //| queryEngine // TODO: DEFINE query engine
    | string 
    | NamedNode
    | URL
    | Store

interface inputStore {
    [name: string]: {
        store: baseStore
        write?: boolean,
        read?: boolean,
        default?: boolean,
        context?: JsonLdContext
    } | baseStore
}

interface groups {
    [group: string]: {
        stores: inputStore,
        default: boolean,
        context?: JsonLdContext
    }
}

export default class StoresFactory {

    // private storeRelations = new PathFactory({
    //     queryEngine: new CommunicaEngine(new Store), context: {
    //         'writable': 'http://example.org#writable',
    //         'readable': 'http://example.org#readable',
    //         'group': 'http://example.org#group',
    //         'store': 'http://example.org#store',
    //         'default': 'http://example.org#default',
    //         'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    //         'a': 'rdf:type',
    //         'typeOf': { '@reverse' : 'rdf:type' }
    //     }
    // })

    // private stores: {
    //     [store: string]: PathFactory
    // } = {}

    // private defaultContext: JsonLdContext = {
    //     // TODO: add defaults from on2ts
    // }

    // async getStores(name: string) {
    //     // List of stores that the LDFlex query will be run over.
    //     // *USING COMMUNICA IS BETTER IF WE ALWAYS WANT TO TREAT THEM AS THE SAME SOURCE*
    //     let storeList: storeList = [];
    //     let editPath = true
    //     const storesGraph = this.storeRelations.create({ subject: name })
    //     switch (`${storesGraph.a}`) {
    //         case 'http://example.org/group':
    //             for await (const store of storesGraph.typeOf) {
    //                 storeList.concat((await this.getStores(store)).storeList)
    //             }
    //         case 'http://example.org/store':
    //             storeList.push({ pathFactory: this.stores[`${storesGraph}`], read: storesGraph.writable.valueOf, write: storesGraph.readable.valueOf })
    //         default:
    //             for await (const store of this.storeRelations.execute('SELECT DISTINCT ?subject WHERE { ?subject <http://example.org/default> true }'))
    //                 storeList.concat((await this.getStores(store)).storeList);
    //             // If there are no default stores then use *every* store
    //             if (storeList.length === 0) {
    //                 for await (const store of this.storeRelations.create({ subject : namedNode('http://example.org#store')}, null).typeOf) 
    //                     storeList.concat((await this.getStores(store)).storeList);
    //             }
    //             editPath = false
    //     }
    //     return { storeList, editPath }
    // }

    // async getAll() {
    //     let storeList: { pathFactory: PathFactory, read: boolean, write: boolean }[] = [];
    //     console.log(await this.storeRelations.create({ subject: 'http://example.org#store' }))
    //     console.log(await this.storeRelations.create({ subject: 'http://example.org#store' }).settings.parsedContext)
    //     console.log(await this.storeRelations.create({ subject: 'http://example.org#store' }).typeOf)

    //     for await (const store of this.storeRelations.create({ subject: 'http://example.org#store' }).typeOf) {
    //         storeList.push({ pathFactory: this.stores[`${store}`], read: store.read.valueOf, write: store.write.valueOf })
    //     }
    //     return storeList
    // }

    // addStore({ 
    //     store, 
    //     name = typeof store === 'string' ? store : String(hashCode(store.toString())), 
    //     isDefault = false, 
    //     read = true, 
    //     write = false, 
    //     group, 
    //     context 
    // }: {
    //     store: baseStore,
    //     name: string,
    //     isDefault: boolean,
    //     read: boolean,
    //     write: boolean,
    //     group?: string,
    //     context?: JsonLdContext
    // }) {
    //     this.stores = {
    //         ...this.stores, [name]: store instanceof PathFactory ? store : new PathFactory({
    //             queryEngine: typeof store === 'string' ? new CommunicaEngine(store) : store,
    //             context: context ?? this.defaultContext
    //         })
    //     };

    //     // Add *details* about the store to the store relations
    //     const storePath = this.storeRelations.create({ subject: namedNode(name) });
    //     storePath.a = namedNode('http://example.org#store');
    //     storePath.default = isDefault;
    //     storePath.write = write;
    //     storePath.read = read;
    //     if (group) {
    //         storePath.group = namedNode(group);
    //         this.storeRelations.create({ subject: namedNode(group) }).a = namedNode('http://example.org#group');
    //     };
    // }

    // addGroup({ stores, group, default: isDefault = false, context }: {
    //     stores: inputStore,
    //     default: boolean,
    //     group?: string,
    //     context?: JsonLdContext
    // }) {
    //     for (const subject in stores) {
    //         // Add the *path factory* to the stores object
    //         const store = stores[subject]
    //         this.addStore({
    //             store: typeof store === 'object' && 'store' in store ? store.store : store,
    //             name: subject,
    //             isDefault: typeof store === 'object' && 'default' in store ? (store.default ?? isDefault) : isDefault,
    //             read: typeof store === 'object' && 'read' in store ? store.read : true,
    //             write: typeof store === 'object' && 'write' in store ? store.write : false,
    //             group,
    //             context: typeof store === 'object' && 'context' in store ? store.context : context
    //         })
    //     }
    // }

    // addGroups(groups: groups) {
    //     for (const group in groups) {
    //         this.addGroup({ group, ...groups[group] })
    //     }
    // }

    // remove(name: string) {
    //     delete this.storeRelations.create({ subject: namedNode(name) }).a
    // }

    // constructor(initializer: groups | inputStore | baseStore) {
    //     if (initializer) {
            
    //     }
    // }


    // query(pathData: pathData, path: path, stores: storeList) {
    //     path.mutationExpressions
    //     pathData.
    // }

    // handle(pathData: pathData, path: path) {
    //     // TODO : Retain sorting when accessing data from multiple sources
        
    //     Repeater.merge
    //     this.storeRelations.create({ subject: pathData.predicate })
    // }

    // initStore(store: baseStore, settings?: {}) {




    //     const queryEngine = new CommunicaEngine(store)
    //     queryEngine._engine = newEngine()
    //     return new Proxy(new PathFactory({ queryEngine, context: {} }), extendedPathFactoryHandlers)
    // }

    // constructor (stores : storeConstructor) {
    //     if (typeof stores === 'string' || stores instanceof NamedNode) {
    //         // TODO : fix the 'as' statement
    //         this.default = 'store'
    //         this.stores['store'] = {
    //             primary : this.initStore(stores as baseStore),
    //             secondary : []
    //         }


    //         this.stores = { default : '' '' : { primary : this.initStore(stores as baseStore), others : [] } }
    //     // Looks like we are taking sintance of the wrong named note
    //     } else if (stores?.primary && !stores?.primary?.primary) {

    //     } else if () {

    //     }


    //     return new Proxy(this, {
    //         get() {

    //         },
    //         set () {

    //         }
    //     })

    //     // TODO: Expand to handle any type of the above format

}