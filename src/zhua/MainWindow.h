#pragma once

class MainWindow : public QMainWindow {
	Q_OBJECT

public:
	explicit MainWindow(QWidget * parent = nullptr);
	~MainWindow();

private:
	void initMenu();
	void onViewLoadFinished(bool ok);
	void onViewLoadProgress(int progress);
	void onViewLoadStarted();
	void slotNavigate();
	void inject();
	void slotShowDevTool();

	void	cookieAdded(const QNetworkCookie &cookie);
		void	cookieRemoved(const QNetworkCookie &cookie);

private:
	QString m_injectScriptID;
	QWebEngineView * m_view;
	//enum InjectStates {
	//	IS_NOTYET,
	//	IS_INJECTING,
	//	IS_FAILED,
	//	IS_SUCCESSED,
	//};
	//InjectStates m_injectState;
};