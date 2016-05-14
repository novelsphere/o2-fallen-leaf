# o2-fallen-leaf

[![Build Status](https://travis-ci.org/novelsphere/o2-fallen-leaf.svg?branch=master)](https://travis-ci.org/novelsphere/o2-fallen-leaf)

Add leaves falling effect.

- Image animation using sprites
- Can specify number of leat, velocity and acceleration range.
- Used in [The house in fata morgana](http://novect.net/top2.html)

葉っぱが落ちるエフェクトを追加する。

- Spritesでアニメーションをする
- 葉っぱの数、スピードと加速度も指定できる 
- [ファタモルガーナの館](http://novect.net/top2.html) で使われてる

## Usage 使い方

- Download `fallen-leaf.js`

- Move the file to your project's plugin folder, optionally copy the images in the `images` folder as well, to your `data` folder

- Add this to the beginning of your `first.ks`
  ```
  [o2_loadplugin module="fallen-leaf.js"]
  ```

- Enable the effect like this:
  ```
  [leafinit num=24]
  ```
  - Show 24 leaves at the same time
  - Look at attributes for more customization

- Stop the effect

  ```
  [leafuninit]
  ```

------

- `fallen-leaf.js` をダウンロード

- ファイルをプロジェクトの plugin フォルダーに移動、もし内臓の画像を使うなら`images`フォルダーの中の画像を`data`フォルダーにコピーしてください

- `first.ks` の最初にこれを追加

  ```
  [o2_loadplugin module="fallen-leaf.js"]
  ```

- こういう風にエフェクトを始める

  ```
  [leafinit num=24]
  ```

  - 葉っぱを24枚表示する
  - 動きをもっとカストマイズしたければ属性を読んでください

- エフェクトを停止する

  ```
  [leatuninit]
  ```

------

### Tag Reference タグリファレンス

#### [leafinit]

Set the behaviour of the effect and start it.

 エフェクトの設定をして、そして開始する。

- num
  - Default: 24
  - Number of leaves displayed at the same time
  - 同時に表示される葉っぱの数
- All attributes from [leafopt]
- [leafopt]の属性を全て使えます

#### [leafopt]

Configurate the behaviour of the effect.
エフェクトの設定をする。

- forevisible
  - true | false
  - Are leaves visible on fore layers
  - fore のレイヤーに表示するか
- backvisible
  - true | false
  - Are leaves visible on back layers
  - back のレイヤーに表示するか
- xinitvelocitymin
  - The minimum x velocity at the start of the effect
  - 最初の横の移動速度の下限
- xinitvelocitymax
  - The maximum x velocity at the start of the effect
  - 最初の横の移動速度の上限
- xinitaccelerationmin
  - The minimum x acceleration at the start of the effect
  - 最初の横の加速度の下限
- xinitaccelerationmax
  - The maximum x acceleration at the start of the effect
  - 最初の横の加速度の上限
- xvelocitymin
  - The minimum x velocity
  - 横の移動速度の下限
- xvelocitymax
  - The maximum x velocity
  - 横の移動速度の上限
- xaccelerationmin
  - The minimum x acceleration
  - 横の加速度の下限
- xaccelerationmax
  - The maximum acceleration
  - 横の加速度の上限
- xaccelerationdelta
  - The maximum changes to the x acceleration
  - 横の加速度の最大変化
- yinitvelocitymin
  - The minimum y velocity at start
  - 最初の縦の移動速度の下限
- yinitvelocitymax
  - The maximum y velocity at start
  - 最初の縦の移動速度の上限
- yinitaccelerationmin
  - The minimum initial y acceleration
  - 最初の縦の加速度の下限
- yinitaccelerationmax
  - The maximum initial y acceleration
  - 最初の縦の加速度の上限
- images
  - Image sprites for animation, separated by comma
  - 葉っぱの画像を指定する、コンマで分ける
  - e.g. "ichou1,"ichou2",momiji1,momiji2,sakura1,sakura2"

#### [leafpause]

Pause the effect
エフェクトを一時停止する

