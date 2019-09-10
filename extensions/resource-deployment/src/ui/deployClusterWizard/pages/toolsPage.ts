/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as azdata from 'azdata';
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import { DeployClusterWizard } from '../deployClusterWizard';
import { SectionInfo } from '../../../interfaces';
import { initializeWizardPage, Validator, InputComponents } from '../../modelViewUtils';
import { WizardPageBase } from '../../wizardPageBase';
const localize = nls.loadMessageBundle();

export class ToolsPage extends WizardPageBase<DeployClusterWizard> {
	private inputComponents: InputComponents = {};

	constructor(wizard: DeployClusterWizard) {
		super(localize('deployCluster.ToolsPageTitle', "Required tools"), '', wizard);
	}

	public initialize(): void {
		const validators: Validator[] = [];
		const sectionInfoArray: SectionInfo[] = [];
		initializeWizardPage({
			page: this.pageObject,
			sections: sectionInfoArray,
			container: this.wizard.wizardObject,
			onNewDisposableCreated: (disposable: vscode.Disposable): void => {
				this.wizard.registerDisposable(disposable);
			},
			onNewInputComponentCreated: (name: string, component: azdata.DropDownComponent | azdata.InputBoxComponent | azdata.CheckBoxComponent): void => {
				this.inputComponents[name] = component;
			},
			onNewValidatorCreated: (validator: Validator): void => {
				validators.push(validator);
			}
		});
	}
}
