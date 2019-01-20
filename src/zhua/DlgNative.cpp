#include "stdafx.h"
#include "DlgNative.h"
#include "GeneratedFiles/ui_DlgNative.h"  


DlgNative::DlgNative(QWidget * parent, const QMap<QString, QString> & data)
	: QDialog(parent)
	, ui(new Ui::DlgNative)
	, m_data(data)
{
	ui->setupUi(this);
	connect(ui->btnJson, SIGNAL(clicked()), this, SLOT(btnJsonClicked));
	connect(ui->listWidget, SIGNAL(itemClicked(QListWidgetItem *)), this, SLOT(itemClicked(QListWidgetItem *)));
}

void DlgNative::btnJsonClicked(){
	auto doc = QJsonDocument::fromJson(ui->textEdit->toPlainText().toUtf8());
	if (doc.isNull()) { return; }
	auto byteArray = doc.toJson(QJsonDocument::Indented);
	QString string; string.prepend(byteArray);
	ui->textEdit->setText(string);
}

void DlgNative::itemClicked(QListWidgetItem * item){
	auto key = item->text();
	ui->textEdit->setText(m_data[item->text()]);
}

DlgNative::~DlgNative() {
	delete ui;
}

void DlgNative::ShowNativeDialog(const QMap<QString, QString> & data) {
	DlgNative dlg(nullptr, data);
	dlg.ui->listWidget->addItems(data.keys());
	int retVal = dlg.exec();
}