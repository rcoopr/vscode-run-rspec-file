export const EXTENSION_NAME = 'vscode-run-rspec-file'
export const SETTINGS_RSPEC_COMMAND_KEY = `${EXTENSION_NAME}.custom-command`
export const SETTINGS_RSPEC_FOLDER = `${EXTENSION_NAME}.folder`
export const SETTINGS_RSPEC_CONTROLLER_FOLDER = `${EXTENSION_NAME}.controller-spec-directory`
export const SETTINGS_SUFFIX_FILE = `${EXTENSION_NAME}.suffix`
export const SETTINGS_INTEGRATION_TYPE = `${EXTENSION_NAME}.integration`
export const SETTINGS_CODE_LENS_ENABLED = `${EXTENSION_NAME}.code-lens-enabled`
export const SETTINGS_CODE_LENS_SELECTOR = `${EXTENSION_NAME}.code-lens-selector`

export type SettingsType = {
  customCommand?: any
  folder?: any
  suffix?: any
  controllerFolder?: any
  integration?: any
  codeLensEnabled?: any
  codeLensSelector?: any
}

export const SETTINGS_DEFAULT: SettingsType = {
  customCommand: 'bundle exec rspec',
  folder: 'spec',
  suffix: 'spec',
  controllerFolder: 'controllers',
  integration: 'rails',
  codeLensEnabled: true,
  codeLensSelector: '**/*_spec.rb',
}
