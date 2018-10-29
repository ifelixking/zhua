#pragma once

class MainWindow : public QMainWindow{
	Q_OBJECT

public:
	explicit MainWindow(QWidget * parent = nullptr);
	~MainWindow();

protected:
	void resizeEvent(QResizeEvent *);

private:
	QWebEngineView * m_view;
};