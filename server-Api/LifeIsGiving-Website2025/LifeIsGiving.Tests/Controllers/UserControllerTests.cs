using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using LifeIsGiving_Website2025.Controller;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Models.Enums;
using System.Collections.Generic;
using System.Threading.Tasks;

public class UserControllerTests
{
    private readonly Mock<IUserService> _userServiceMock;
    private readonly UserController _controller;

    public UserControllerTests()
    {
        _userServiceMock = new Mock<IUserService>();
        _controller = new UserController(_userServiceMock.Object);
    }

    [Fact]
    public async Task GetUsers_ReturnsListOfUsers()
    {
        // Arrange
        var users = new List<UserDto>
        {
            new UserDto { UserName = "user1", Name = "User One", Email="u1@test.com", Role = UserRole.Admin },
            new UserDto { UserName = "user2", Name = "User Two", Email="u2@test.com", Role = UserRole.Buyer }
        };
        _userServiceMock.Setup(s => s.GetUsers()).ReturnsAsync(users);

        // Act
        var result = await _controller.GetUsers();

        // Assert
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult!.Value.Should().BeEquivalentTo(users);
    }

    [Fact]
    public async Task GetUserById_UserExists_ReturnsOk()
    {
        // Arrange
        var user = new UserDto { UserName = "user1", Name = "User One", Email = "u1@test.com", Role = UserRole.Buyer };
        _userServiceMock.Setup(s => s.GetUserById(1)).ReturnsAsync(user);

        // Act
        var result = await _controller.GetUserById(1);

        // Assert
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult!.Value.Should().BeEquivalentTo(user);
    }

    [Fact]
    public async Task GetUserById_UserNotFound_ReturnsNotFound()
    {
        // Arrange
        _userServiceMock.Setup(s => s.GetUserById(2)).ReturnsAsync((UserDto?)null);

        // Act
        var result = await _controller.GetUserById(2);

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task AddUser_ValidUser_ReturnsOk()
    {
        // Arrange
        var createDto = new UserCreateDto
        {
            UserName = "newuser",
            Name = "New User",
            Email = "newuser@test.com",
            Password = "pass123",
            Role = UserRole.Buyer
        };

        // Act
        var result = await _controller.AddUser(createDto);

        // Assert
        result.Should().BeOfType<OkResult>();
        _userServiceMock.Verify(s => s.AddUser(createDto), Times.Once);
    }

    [Fact]
    public async Task UpdateUser_UserExists_ReturnsNoContent()
    {
        // Arrange
        var updateDto = new UserUpdateDto { Name = "Updated Name" };
        _userServiceMock.Setup(s => s.UpdateUser(1, updateDto)).ReturnsAsync(true);

        // Act
        var result = await _controller.UpdateUser(1, updateDto);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task UpdateUser_UserNotFound_ReturnsNotFound()
    {
        // Arrange
        var updateDto = new UserUpdateDto { Name = "Updated Name" };
        _userServiceMock.Setup(s => s.UpdateUser(2, updateDto)).ReturnsAsync(false);

        // Act
        var result = await _controller.UpdateUser(2, updateDto);

        // Assert
        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task DeleteUser_UserExists_ReturnsNoContent()
    {
        // Arrange
        _userServiceMock.Setup(s => s.DeleteUser(1)).ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteUser(1);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task DeleteUser_UserNotFound_ReturnsNotFound()
    {
        // Arrange
        _userServiceMock.Setup(s => s.DeleteUser(2)).ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteUser(2);

        // Assert
        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task GetDonors_ReturnsListOfDonors()
    {
        // Arrange
        var donors = new List<UserDonorDto>
        {
            new UserDonorDto { UserName = "donor1", Name = "Donor One", Email="d1@test.com", Role = UserRole.Donor },
            new UserDonorDto { UserName = "donor2", Name = "Donor Two", Email="d2@test.com", Role = UserRole.Donor }
        };
        _userServiceMock.Setup(s => s.GetDonors()).ReturnsAsync(donors);

        // Act
        var result = await _controller.GetDonors();

        // Assert
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult!.Value.Should().BeEquivalentTo(donors);
    }

    [Fact]
    public async Task GetBySort_ReturnsFilteredDonors()
    {
        // Arrange
        var filtered = new List<UserDto>
{
    new UserDto { UserName = "donor1", Name = "Filtered Donor", Email="filter@test.com", Role = UserRole.Donor }
};

        _userServiceMock
            .Setup(s => s.GetBySort(It.IsAny<string?>(), It.IsAny<string?>(), It.IsAny<string?>()))
            .ReturnsAsync(filtered);






        // Act
        var result = await _controller.GetBySort("Filtered", "filter@test.com", null);

        // Assert
        var okResult = result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult!.Value.Should().BeEquivalentTo(filtered);
    }


}
