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

declare module 'react-addons-update' {
	const update: any;
	export default update;
}

declare  module 'parse-github-url'{
	const parser: any;
	export default parser;
}