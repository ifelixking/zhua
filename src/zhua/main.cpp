#include "stdafx.h"

#include "MainWindow.h"

int main(int argc, char * argv[])
{
	QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
	QApplication app(argc, argv);

	MainWindow mainWindow;
	auto rect = Utils::GetCenterStartup(QSize(1280, 960));
	mainWindow.setGeometry(rect);
	mainWindow.show();

	return app.exec();
}