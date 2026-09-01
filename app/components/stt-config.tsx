import { STTConfig } from "../store";
import Locale from "../locales";
import { ListItem, PasswordInput } from "./ui-lib";

export function STTConfigList(props: {
  sttConfig: STTConfig;
  updateConfig: (updater: (config: STTConfig) => void) => void;
}) {
  return (
    <>
      <ListItem
        title={Locale.Settings.STT.Enable.Title}
        subTitle={Locale.Settings.STT.Enable.SubTitle}
      >
        <input
          type="checkbox"
          checked={props.sttConfig.enable}
          onChange={(e) =>
            props.updateConfig(
              (config) => (config.enable = e.currentTarget.checked),
            )
          }
        />
      </ListItem>
      {props.sttConfig.enable && (
        <>
          <ListItem
            title={Locale.Settings.STT.BaseUrl.Title}
            subTitle={Locale.Settings.STT.BaseUrl.SubTitle}
            vertical
          >
            <input
              type="url"
              value={props.sttConfig.baseUrl}
              placeholder="http://127.0.0.1:10095"
              onChange={(e) =>
                props.updateConfig(
                  (config) => (config.baseUrl = e.currentTarget.value),
                )
              }
            />
          </ListItem>
          <ListItem title={Locale.Settings.STT.Model.Title} vertical>
            <input
              type="text"
              value={props.sttConfig.model}
              placeholder="FunAudioLLM/Fun-ASR-Nano-2512"
              onChange={(e) =>
                props.updateConfig(
                  (config) => (config.model = e.currentTarget.value),
                )
              }
            />
          </ListItem>
          <ListItem
            title={Locale.Settings.STT.ApiKey.Title}
            subTitle={Locale.Settings.STT.ApiKey.SubTitle}
            vertical
          >
            <PasswordInput
              value={props.sttConfig.apiKey}
              placeholder={Locale.Settings.STT.ApiKey.Placeholder}
              onChange={(e) =>
                props.updateConfig(
                  (config) => (config.apiKey = e.currentTarget.value),
                )
              }
            />
          </ListItem>
        </>
      )}
    </>
  );
}
