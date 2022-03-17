export interface IComponentsToRender {
    __editorItemTitle:string;
    interfaceComponent:string;
    showComponent:boolean;
}

export interface IList {
    key:string;
    name:string;
}

export interface RenderProps {
    list : IList[];
    componentsToRender: IComponentsToRender[];
}