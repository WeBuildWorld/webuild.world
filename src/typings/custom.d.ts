declare module "*.svg" {
	const content: any;
	export default content;
}

declare module 'react-github-login' {
	export default class GitHubLogin extends React.Component<any> {

	}
}


declare module 'react-select' {
	export default class Select extends React.Component<any> {

	}

	export class components extends React.Component<any> {
		static SingleValue: any;
		static MenuList: any; 
	}


}
