/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { TreeDataProvider, EventEmitter, Event, TreeItem } from 'vscode';
import { setInterval, clearInterval } from 'timers';
import { AppContext } from '../../appContext';
import * as nls from 'vscode-nls';
const localize = nls.loadMessageBundle();

import { TreeNode } from '../treeNode';
import { AzureResourceAccountNotSignedInTreeNode } from './accountNotSignedInTreeNode';
import { AzureResourceContainerTreeNodeBase } from './baseTreeNodes';
import { IAzureResourceTreeChangeHandler } from './treeChangeHandler';

export class AzureResourceTreeProvider implements TreeDataProvider<TreeNode>, IAzureResourceTreeChangeHandler {
	public constructor(
		public readonly appContext: AppContext
	) {
	}

	public async getChildren(element?: TreeNode): Promise<TreeNode[]> {
		if (element) {
			return element.getChildren(true);
		}

		if (!this.isSystemInitialized && !this._loadingTimer) {
			this._loadingTimer = setInterval(async () => {
				try {
					// Call sqlops.accounts.getAllAccounts() to determine whether the system has been initialized.

					// System has been initialized
					this.isSystemInitialized = true;

					if (this._loadingTimer) {
						clearInterval(this._loadingTimer);
					}

					this._onDidChangeTreeData.fire(undefined);
				} catch (error) {
					// System not initialized yet
					this.isSystemInitialized = false;
				}
			}, AzureResourceTreeProvider.loadingTimerInterval);

			return [];
		}

		try {
			return [new AzureResourceAccountNotSignedInTreeNode()];

		} catch (error) {
			return [];
		}
	}

	public get onDidChangeTreeData(): Event<TreeNode> {
		return this._onDidChangeTreeData.event;
	}

	public notifyNodeChanged(node: TreeNode): void {
		this._onDidChangeTreeData.fire(node);
	}

	public async refresh(node: TreeNode, isClearingCache: boolean): Promise<void> {
		if (isClearingCache) {
			if ((node instanceof AzureResourceContainerTreeNodeBase)) {
				node.clearCache();
			}
		}

		this._onDidChangeTreeData.fire(node);
	}

	public getTreeItem(element: TreeNode): TreeItem | Thenable<TreeItem> {
		return element.getTreeItem();
	}

	public isSystemInitialized: boolean = false;

	private _loadingTimer: NodeJS.Timer = undefined;
	private _onDidChangeTreeData = new EventEmitter<TreeNode>();

	private static readonly loadingLabel = localize('azure.resource.tree.treeProvider.loadingLabel', 'Loading ...');
	private static readonly loadingTimerInterval = 5000;
}