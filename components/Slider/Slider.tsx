
import {Component} from 'react';
import * as React from 'react';
import * as classNames from 'classnames';
import {IBaseComponent} from '../template/component';

export interface ISliderProps extends IBaseComponent {
  /**
   * 滑块值 - 受控
   */
  value?: number;
  /**
   * 滑块值 - 非受控
   */
  defaultValue?: number;
  /**
   * 变化回调
   */
  onChange?: (value: number) => void;
  /**
   * 最大值
   */
  max?: number;
  /**
   * 最小值
   */
  min?: number;
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * 步长
   */
  step?: number;
}

export interface ISliderDefaultProps extends IBaseComponent {
  defaultValue: number;
  max: number;
  min: number;
  disabled: boolean;
  step: number;
}

export interface ISliderState {

}

/**
 * **滑动输入条**-用于拖动选取当前值
 */
export class Slider extends Component<ISliderProps, ISliderState> {
  refSlider: HTMLElement;
  moving: boolean = false; // 当前是否处于拖动状态

  static defaultProps: ISliderDefaultProps = {
    defaultValue: 0,
    max: 100,
    min: 0,
    disabled: false,
    step: 1,
  };

  state = {
    value: this.props.defaultValue as number,
  };

  getValue = () => {
    const {value} = this.props;
    return value !== undefined ? value : this.state.value;
  }

  getStepPercent = () => {
    const {max, min, step} = this.props as ISliderDefaultProps;
    const range = max - min;
    const percent = step / range;
    return +percent.toFixed(4);
  }

  getPercent = () => {
    const {max, min} = this.props as ISliderDefaultProps;
    const value = this.getValue();
    const range = max - min;
    const percent = (value - min) / range;
    return +percent.toFixed(4);
  }

  onSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const {max, min} = this.props  as ISliderDefaultProps;
    const slider = this.refSlider;
    const sliderRect = slider.getBoundingClientRect() as DOMRect;
    const sliderWidth = sliderRect.width;  // 滑动条宽度
    const left = e.clientX - (sliderRect.x || sliderRect.left); // 点击位置相对滑动条偏移量
    const newPercent = +(left / sliderWidth).toFixed(4);
    const oldPercent = this.getPercent();
    const stepPercent = this.getStepPercent();
    const change = newPercent - oldPercent;
    const times = Math.abs(Math.round(change / stepPercent));
    if (times !== 0) {
      const changePercent = times * stepPercent;
      const percent = change > 0 ? oldPercent + changePercent : oldPercent - changePercent;
      this.onChangeTrigger(min + Math.round((max - min) * percent));
    }
    this.moving = false;
  }

  onSliderMouseDown = () => {
    const {max, min} = this.props as ISliderDefaultProps;
    const slider = this.refSlider;
    const sliderRect = slider.getBoundingClientRect() as DOMRect;
    const sliderWidth = sliderRect.width;  // 滑动条宽度

    const bodyMouseMove = (e: MouseEvent) => {
      const left = e.clientX - (sliderRect.x || sliderRect.left); // 点击位置相对滑动条偏移量

      // 当前偏移量处于滑动条外 不进行value刷新
      if (left < 0 || left > sliderWidth) {
        return;
      }
      const newPercent = +(left / sliderWidth).toFixed(4);
      const oldPercent = this.getPercent();
      const stepPercent = this.getStepPercent();
      const change = newPercent - oldPercent;
      const times = Math.abs(Math.round(change / stepPercent));
      if (times !== 0) {
        const changePercent = times * stepPercent;
        const percent = change > 0 ? oldPercent + changePercent : oldPercent - changePercent;
        this.onChangeTrigger(min + Math.round((max - min) * percent));
      }
      // this.onChangeTrigger(min + Math.round((max - min) * percent));
    };

    const bodyMouseUp = () => {
      document.body.removeEventListener('mousemove', bodyMouseMove);
      document.body.removeEventListener('mouseup', bodyMouseUp);
    };

    document.body.addEventListener('mousemove', bodyMouseMove);
    document.body.addEventListener('mouseup', bodyMouseUp);
  }

  onChangeTrigger = (value: number) => {
    // 节流 - 当value发生变化时才刷新
    if (value === this.getValue()) {
      return;
    }

    const {onChange, disabled} = this.props;
    if (disabled) {
      return;
    }

    this.setState({
      value,
    });
    if (onChange) {
      onChange(value);
    }
  }

  render() {
    const {
      className, style, children, defaultValue,
      disabled, onChange, step, ...otherProps} = this.props;
    const preCls = 'yoshino-slider';
    const clsName = classNames(
      preCls,
      {[`${preCls}-disabled`]: disabled},
      className,
    );
    const barStyle = {width: `${this.getPercent() * 100}%`};
    return (
      <div
        className={clsName}
        style={style}
        onClick={this.onSliderClick}
        onMouseDown={this.onSliderMouseDown}
        {...otherProps}
        ref={(v) => {
          if (v) {
            this.refSlider = v;
          }
        }}
      >
        <div className={`${preCls}-process`}/>
        <div className={`${preCls}-bar`} style={barStyle}/>
      </div>
    );
  }
}

export default Slider;
