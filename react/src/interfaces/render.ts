export interface IComponentsToRender {
    __editorItemTitle:string;
    interfaceComponent:string;
    showComponent:boolean;
    background:IBackground;
}

export interface IBackground{
    color:string;
    image:string;
}
export interface IList {
    key:string;
    name:string;
}

export interface RenderProps {
    list : IList[];
    componentsToRender: IComponentsToRender[];
}

export interface IBlock{
    extensionPointId:string;
}