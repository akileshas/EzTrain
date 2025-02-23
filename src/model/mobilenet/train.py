import torch
import torch.nn as nn
import torch.optim as optim


def train_model(
    model,
    dataloader,
    num_epochs=5,
    learning_rate=0.001,
):
    model.train()

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(
        model.classifier.parameters(),
        lr=learning_rate,
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    loss_values = []
    for epoch in range(num_epochs):
        total_loss = 0.0
        for images, labels in dataloader:
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            total_loss += loss.item()
            loss_values.append(
                round(loss.item() * 100, 5),
            )

        avg_loss = total_loss / \
            len(dataloader) if len(dataloader) > 0 else float("inf")
        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {avg_loss:.4f}")

    return loss_values
