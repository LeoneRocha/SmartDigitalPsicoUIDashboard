import { AngularEditorConfig } from '@kolkov/angular-editor';

export class AngularEditorConfigHelper {

    static getEditorConfig(screenWidth: number): AngularEditorConfig {
        let fontSize = '16px';

        if (screenWidth <= 600) {
            fontSize = '14px'; // Tamanho para telas pequenas
        } else if (screenWidth > 600 && screenWidth <= 1024) {
            fontSize = '16px'; // Tamanho para telas médias
        } else {
            fontSize = '18px'; // Tamanho para telas grandes
        } 
        return {
            editable: true,
            spellcheck: true,
            height: 'auto',
            minHeight: '0',
            maxHeight: 'auto',
            width: 'auto',
            minWidth: '0',
            translate: 'yes',
            enableToolbar: true,
            showToolbar: true,
            placeholder: 'Enter text here...',
            defaultParagraphSeparator: '',
            defaultFontName: '',
            defaultFontSize: fontSize,
            fonts: [
                { class: 'arial', name: 'Arial' },
                { class: 'times-new-roman', name: 'Times New Roman' },
                { class: 'calibri', name: 'Calibri' },
                { class: 'comic-sans-ms', name: 'Comic Sans MS' }
            ],
            customClasses: [
                {
                    name: 'quote',
                    class: 'quote',
                },
                {
                    name: 'redText',
                    class: 'redText'
                },
                {
                    name: 'titleText',
                    class: 'titleText',
                    tag: 'h1',
                },
            ],
            uploadUrl: 'v1/image',
            uploadWithCredentials: false,
            sanitize: false,
            toolbarPosition: 'top',
            toolbarHiddenButtons: [
                ['bold', 'italic'],
                ['fontSize']
            ]
        };
    }
}
