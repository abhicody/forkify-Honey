import icons from 'url:../../img/icons.svg';
import View from './Views';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    'chal re gaandu ye Dish apun ke idhar nahi milti🤣😂😆.please try again!';
  _message = '';

  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
