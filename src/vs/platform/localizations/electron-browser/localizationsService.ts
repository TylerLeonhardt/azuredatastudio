/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { Event } from 'vs/base/common/event';
import { ILocalizationsService, LanguageType } from 'vs/platform/localizations/common/localizations';
import { ISharedProcessService } from 'vs/platform/ipc/electron-browser/sharedProcessService';

export class LocalizationsService implements ILocalizationsService {

	_serviceBrand: undefined;

	private channel: IChannel;

	constructor(@ISharedProcessService sharedProcessService: ISharedProcessService) {
		this.channel = sharedProcessService.getChannel('localizations');
	}

	get onDidLanguagesChange(): Event<void> { return this.channel.listen('onDidLanguagesChange'); }

	getLanguageIds(type?: LanguageType): Promise<string[]> {
		return this.channel.call('getLanguageIds', type);
	}
}
