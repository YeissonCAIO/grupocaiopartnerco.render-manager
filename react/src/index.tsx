import React, { useMemo } from 'react';
import { pathOr } from 'ramda';
import { Block } from 'vtex.render-runtime';
import { IComponentsToRender, RenderProps } from './interfaces/render'

const BACKUP_COMPONENTS_KEYS = "@render-manager-list";


const Render = (props: any) => {

    const componentsToRender = pathOr<IComponentsToRender[]>([], ['componentsToRender'], props);
    const foldRender = pathOr<number>(1, ['foldRender'], props);

    const componentsToRenderActives = useMemo<IComponentsToRender[]>(() => {
        return componentsToRender.filter((item: any) => item.showComponent);
    }, [componentsToRender]);

    return (
        <div>
            {componentsToRenderActives.map((item, index) => {
                console.log("item", item)

                const interfaceComponent = pathOr<string>("", ["interfaceComponent"], item)

                if ((index + 1) % foldRender === 0) {
                    console.log("Entro", index)
                    return (
                        <>

                            {interfaceComponent ? <Block id={interfaceComponent} key={`render-component-${index}`} /> : <></>}
                            <Block id="__fold__" key={`render-fold-component-${index}`} />
                            <div>Fold</div>
                        </>
                    )
                }

                return (
                    <>
                        {interfaceComponent ? <Block id={interfaceComponent} key={`render-component-${index}`} /> : <></>}
                    </>
                )
            })}
        </div>
    )
}


Render.defaultProps = {
    componentsToRender: [],
    foldRender: 3
}

Render.getSchema = (props: RenderProps) => {

    let localProps = Object.assign({}, props);

    if (props && props?.list && !props?.componentsToRender) {

        window.sessionStorage.setItem(BACKUP_COMPONENTS_KEYS, JSON.stringify(props))
    }
    else {
        localProps = JSON.parse(window.sessionStorage.getItem(BACKUP_COMPONENTS_KEYS) || "{list:[]}")
    }

    const names = pathOr([], ["list"], localProps).map(n => n.name);
    const values = pathOr([], ["list"], localProps).map(n => n.key);

    return {
        title: "Render Manager",
        type: "object",
        properties: {
            componentsToRender: {
                minItems: 0,
                title: "Components list",
                type: "array",
                items: {
                    title: "Component list",
                    type: "object",
                    properties: {
                        __editorItemTitle: {
                            title: "Component Name",
                            type: "string"
                        },
                        interfaceComponent: {
                            title: "Component",
                            type: "string",
                            enum: values,
                            enumNames: names
                        },
                        showComponent: {
                            title: "Show Component",
                            type: "boolean",
                            default: true
                        }
                    }
                }
            },
            foldRender: {
                title: "Fold Render",
                type: "number",
                default: 3
            }
        }
    }
}

export default Render;
