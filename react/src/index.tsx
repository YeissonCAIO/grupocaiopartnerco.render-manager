import React, { useEffect, useMemo } from 'react';
import { pathOr, find } from 'ramda';
import { Block, useRuntime, useTreePath } from 'vtex.render-runtime';
import { IComponentsToRender, RenderProps, IBlock } from './utils/interfaces';
import Style from './index.css';
import RichText from 'vtex.rich-text/index';

const BACKUP_COMPONENTS_KEYS = "@render-manager-list";
const CUSTOM_ID_SITE_EDITOR = "CUSTOM-RENDER-MANAGER";


const Render = (props: any) => {

    const { treePath } = useTreePath();
    const useruntime = useRuntime();
    const isSiteEditor = useMemo<boolean>(() => JSON.parse(pathOr("false", ["route", "queryString", "__siteEditor"], useruntime)), [useruntime])
    const componentsToRender = useMemo(() => pathOr<IComponentsToRender[]>([], ['componentsToRender'], props), [props])
    const foldRender = useMemo(() => pathOr<number>(1, ['foldRender'], props), [props]);

    const componentsToRenderActives = useMemo<IComponentsToRender[]>(() => {
        return componentsToRender.filter((item: any) => item.showComponent);
    }, [componentsToRender]);

    useEffect(() => {

        if (isSiteEditor) {

            try {
                const managerList = pathOr([], ["extensions", treePath, "blocks"], useruntime)
                    .filter((block: IBlock) => {
                        const finded = (e: any) => e.interfaceComponent === block.extensionPointId;
                        return !find(finded)(componentsToRenderActives)
                    })
                    .map((block: IBlock) => {
                        const path = `${treePath}/${block.extensionPointId}`
                        return `div[data-tree-path="${path}"]`
                    })


                const managerListShow = pathOr([], ['extensions', treePath, "blocks"], useruntime)
                    .map((block: IBlock) => {
                        const finded = (e: any) => e.interfaceComponent === block.extensionPointId;
                        const element = find(finded)(componentsToRenderActives);
                        if (!!element) {
                            return {
                                ...block,
                                ...element
                            }
                        } else {
                            return null

                        }

                    })
                    .filter(e => !!e).map(e => {
                        const path = `${treePath}/${e.extensionPointId}`
                        return `div[data-tree-path="${path}"] > div > .vtex-admin-pages-4-x-track-1 {font-size: 0;}div[data-tree-path="${path}"] > div > .vtex-admin-pages-4-x-track-1::before {content: "${e.__editorItemTitle}";font-size: .875rem;}`
                    })


                const css = `
                    ${managerList.join(',')}{
                        display:none
                    }

                    ${managerListShow.join('')}
                    `

                const body: any = window.parent?.document.body;
                const container: any = document.createElement('div');
                const style: any = document.createElement("style");
                container.id = CUSTOM_ID_SITE_EDITOR;
                window.parent?.document.getElementById(CUSTOM_ID_SITE_EDITOR)?.remove();
                style.appendChild(document.createTextNode(css));
                container.appendChild(style);
                body.appendChild(container);

            } catch (error) {
            }

        }

    }, [isSiteEditor, componentsToRender])

    return (
        <div className={Style.containerRenderManager}>
            {componentsToRenderActives.map((item, index) => {

                const interfaceComponent = pathOr<string>("", ["interfaceComponent"], item);
                const color = pathOr<string>("", ['background', 'color'], item);
                const image = pathOr<string>("", ["background", 'image'], item);
                const prevText = pathOr<string>("", ['prevText'], item);
                const margin = pathOr<string>("", ['spacing', 'margin'], item);
                const padding = pathOr<string>("", ['spacing', 'padding'], item);
                const blockClass = pathOr<string>("", ["blockClass"], item);
                const background = image ? `url(${image})` : color;

                if ((index + 1) % foldRender === 0) {
                    return (
                        <div style={{ ...image ? { backgroundImage: background } : { backgroundColor: background }, margin, padding, boxSizing: 'border-box' }} className={`${Style.ItemRenderManager} ${blockClass ? 'grupocaiopartnerco-render-manager-0-x-' + blockClass : null}`}>
                            {prevText && <RichText text={prevText} />}

                            {interfaceComponent ? <Block id={interfaceComponent} key={`render-component-${index}`} /> : <></>}
                            <Block id="__fold__" key={`render-fold-component-${index}`} />
                            <div>Fold</div>
                        </div>
                    )
                }

                return (
                    <div style={{ ...image ? { backgroundImage: background } : { backgroundColor: background }, margin, padding, boxSizing: 'border-box' }} className={Style.ItemRenderManager}>
                        {prevText && <RichText text={prevText} />}
                        {interfaceComponent ? <Block id={interfaceComponent} key={`render-component-${index}`} /> : <></>}
                    </div>
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

    const copyRight = () => {
        return (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', color: '#000', textTransform: 'uppercase', fontSize: '12px' }}>Desarrollado por Grupo CAIO</div>
        )
    }

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
                        },
                        background: {
                            title: "Background",
                            type: "object",
                            properties: {
                                color: {
                                    title: "Background Color",
                                    type: "string",
                                    widget: {
                                        'ui:widget': 'color'
                                    }
                                },
                                image: {
                                    title: "Background Image",
                                    type: 'string',
                                    widget: {
                                        'ui:widget': 'image-uploader'
                                    }
                                }
                            }
                        },
                        spacing: {
                            title: "Spacing",
                            type: "object",
                            properties: {
                                padding: {
                                    title: 'Padding',
                                    type: 'string',
                                    description: "Use Arriba Derecha Abajo Izquierda separado por espacios, ejemplo: 10px 5px 10px 4px"
                                },
                                margin: {
                                    title: 'Margin',
                                    type: 'string',
                                    description: "Use Arriba Derecha Abajo Izquierda separado por espacios, ejemplo: 10px 5px 10px 4px"
                                }
                            }

                        },
                        prevText: {
                            title: "Previous Text",
                            type: "string",
                            widget: {
                                "ui:widget": 'textarea'
                            }
                        },
                        blockClass: {
                            title: "BlockClass",
                            type: 'string'
                        },
                        copy: {
                            title: "",
                            type: "string",
                            widget: {
                                'ui:widget': copyRight
                            }
                        }

                    }
                }
            },
            foldRender: {
                title: "Fold Render",
                type: "number",
                default: 3
            },
            copy: {
                title: "",
                type: "string",
                widget: {
                    'ui:widget': copyRight
                }
            }
        }
    }
}

export default Render;
